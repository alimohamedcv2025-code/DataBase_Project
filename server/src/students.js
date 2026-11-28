const express = require('express');

const fields = [
  ['StudentID', 'id'],
  ['StudentCode', 'studentCode'],
  ['FullName', 'fullName'],
  ['Email', 'email'],
  ['Department', 'department'],
  ['[Level]', 'level'],
];

const columns = fields.map(([column, alias]) => `${column} AS ${alias}`).join(', ');
const inserted = fields.map(([column, alias]) => `inserted.${column} AS ${alias}`).join(', ');

function invalid(message, status = 400) {
  return Object.assign(new Error(message), { status });
}

function validateText(value, label, maxLength, required = false) {
  if (value == null && !required) return null;
  if (typeof value !== 'string') throw invalid(`${label} must be text.`);
  const text = value.trim();
  if (required && !text) throw invalid(`${label} is required.`);
  if (text.length > maxLength) throw invalid(`${label} must be at most ${maxLength} characters.`);
  return text || null;
}

function studentData(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw invalid('Send a student as a JSON object.');
  }
  const studentCode = validateText(body.studentCode, 'Student code', 20, true);
  const fullName = validateText(body.fullName, 'Full name', 120, true);
  const email = validateText(body.email, 'Email', 254);
  const department = validateText(body.department, 'Department', 100);
  const level = body.level ?? null;

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw invalid('Enter a valid email address.');
  }
  if (level !== null && (!Number.isInteger(level) || level < 1 || level > 255)) {
    throw invalid('Level must be a whole number from 1 to 255.');
  }
  return { studentCode, fullName, email, department, level };
}

function studentId(value) {
  const id = Number(value);
  if (!/^\d+$/.test(value) || id < 1 || id > 2147483647) {
    throw invalid('Student ID must be a positive integer.');
  }
  return id;
}

function writeStudent(request, sql, data) {
  return request
    .input('studentCode', sql.NVarChar(20), data.studentCode)
    .input('fullName', sql.NVarChar(120), data.fullName)
    .input('email', sql.NVarChar(254), data.email)
    .input('department', sql.NVarChar(100), data.department)
    .input('level', sql.TinyInt, data.level);
}

function studentRouter(pool, sql) {
  const router = express.Router();

  router.get('/', async (req, res) => {
    const search = validateText(req.query.q, 'Search', 120) ?? '';
    const result = await pool.request().input('search', sql.NVarChar(120), search).query(`
      SELECT ${columns}
      FROM dbo.Students
      WHERE @search = N''
        OR CHARINDEX(@search, StudentCode) > 0
        OR CHARINDEX(@search, FullName) > 0
      ORDER BY FullName, StudentID;
    `);
    res.json(result.recordset);
  });

  router.post('/', async (req, res) => {
    const request = writeStudent(pool.request(), sql, studentData(req.body));
    const result = await request.query(`
      INSERT dbo.Students (StudentCode, FullName, Email, Department, [Level])
      OUTPUT ${inserted}
      VALUES (@studentCode, @fullName, @email, @department, @level);
    `);
    res.status(201).json(result.recordset[0]);
  });

  router.put('/:id', async (req, res) => {
    const id = studentId(req.params.id);
    const request = writeStudent(pool.request(), sql, studentData(req.body));
    const result = await request.input('id', sql.Int, id).query(`
      UPDATE dbo.Students
      SET StudentCode = @studentCode, FullName = @fullName, Email = @email,
          Department = @department, [Level] = @level
      OUTPUT ${inserted}
      WHERE StudentID = @id;
    `);
    if (!result.recordset.length) throw invalid('Student not found.', 404);
    res.json(result.recordset[0]);
  });

  router.delete('/:id', async (req, res) => {
    const id = studentId(req.params.id);
    const result = await pool.request().input('id', sql.Int, id).query(`
      DELETE FROM dbo.Students
      OUTPUT deleted.StudentID AS id
      WHERE StudentID = @id;
    `);
    if (!result.recordset.length) throw invalid('Student not found.', 404);
    res.status(204).end();
  });

  router.use((error, req, res, next) => {
    if (error.number === 2601 || error.number === 2627) {
      return res.status(409).json({ error: 'That student code already exists.' });
    }
    if (req.method === 'DELETE' && error.number === 547) {
      return res.status(409).json({ error: 'This student has enrollment or attendance records and cannot be deleted.' });
    }
    next(error);
  });

  return router;
}

module.exports = { studentRouter };
