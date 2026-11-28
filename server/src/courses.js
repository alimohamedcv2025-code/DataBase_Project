const express = require('express');
const { invalid, validateText, positiveId } = require('./validation');

function writeCourse(request, sql, body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw invalid('Send a course as a JSON object.');
  }
  return request
    .input('courseCode', sql.NVarChar(20), validateText(body.courseCode, 'Course code', 20, true))
    .input('courseName', sql.NVarChar(120), validateText(body.courseName, 'Course name', 120, true))
    .input('instructorName', sql.NVarChar(120), validateText(body.instructorName, 'Instructor name', 120));
}

async function enroll(pool, sql, courseId, studentId) {
  const transaction = pool.transaction();
  await transaction.begin();

  try {
    const result = await transaction.request()
      .input('courseId', sql.Int, courseId)
      .input('studentId', sql.Int, studentId)
      .query(`
        DECLARE @isActive bit;

        -- Lock the unique student/course key, including the gap for a new enrollment.
        SELECT @isActive = IsActive
        FROM dbo.Enrollments WITH (UPDLOCK, HOLDLOCK, INDEX(UQ_Enrollments_Student_Course))
        WHERE StudentID = @studentId AND CourseID = @courseId;

        IF @isActive = 1
            SELECT 'already-enrolled' AS outcome;
        ELSE IF @isActive = 0
        BEGIN
            UPDATE dbo.Enrollments SET IsActive = 1
            WHERE StudentID = @studentId AND CourseID = @courseId;
            SELECT 'reactivated' AS outcome;
        END
        ELSE
        BEGIN
            INSERT dbo.Enrollments (StudentID, CourseID) VALUES (@studentId, @courseId);
            SELECT 'created' AS outcome;
        END;
      `);
    await transaction.commit();
    return result.recordset[0].outcome;
  } catch (error) {
    await transaction.rollback().catch(() => {});
    if (error.number === 547) throw invalid('The student or course could not be found.', 404);
    throw error;
  }
}

function courseRouter(pool, sql) {
  const router = express.Router();

  router.get('/', async (req, res) => {
    const result = await pool.request().query(`
      SELECT CourseID AS id, CourseCode AS courseCode, CourseName AS courseName,
             InstructorName AS instructorName
      FROM dbo.Courses
      ORDER BY CourseName, CourseID;
    `);
    res.json(result.recordset);
  });

  router.post('/', async (req, res) => {
    const result = await writeCourse(pool.request(), sql, req.body).query(`
      INSERT dbo.Courses (CourseCode, CourseName, InstructorName)
      OUTPUT inserted.CourseID AS id, inserted.CourseCode AS courseCode,
             inserted.CourseName AS courseName, inserted.InstructorName AS instructorName
      VALUES (@courseCode, @courseName, @instructorName);
    `);
    res.status(201).json(result.recordset[0]);
  });

  router.put('/:courseId', async (req, res) => {
    const courseId = positiveId(req.params.courseId, 'Course ID');
    const result = await writeCourse(pool.request(), sql, req.body).input('courseId', sql.Int, courseId).query(`
      UPDATE dbo.Courses
      SET CourseCode = @courseCode, CourseName = @courseName, InstructorName = @instructorName
      OUTPUT inserted.CourseID AS id, inserted.CourseCode AS courseCode,
             inserted.CourseName AS courseName, inserted.InstructorName AS instructorName
      WHERE CourseID = @courseId;
    `);
    if (!result.recordset.length) throw invalid('Course not found.', 404);
    res.json(result.recordset[0]);
  });

  router.delete('/:courseId', async (req, res) => {
    const courseId = positiveId(req.params.courseId, 'Course ID');
    try {
      const result = await pool.request().input('courseId', sql.Int, courseId).query(`
        DELETE FROM dbo.Courses
        OUTPUT deleted.CourseID AS id
        WHERE CourseID = @courseId;
      `);
      if (!result.recordset.length) throw invalid('Course not found.', 404);
    } catch (error) {
      if (error.number === 547) {
        throw invalid('This course has enrollment or attendance records and cannot be deleted.', 409);
      }
      throw error;
    }
    res.status(204).end();
  });

  router.get('/:courseId/enrollments', async (req, res) => {
    const courseId = positiveId(req.params.courseId, 'Course ID');
    const result = await pool.request().input('courseId', sql.Int, courseId).query(`
      SELECT s.StudentID AS id, s.StudentCode AS studentCode, s.FullName AS fullName,
             s.Department AS department
      FROM dbo.Courses AS c
      LEFT JOIN dbo.Enrollments AS e ON e.CourseID = c.CourseID AND e.IsActive = 1
      LEFT JOIN dbo.Students AS s ON s.StudentID = e.StudentID
      WHERE c.CourseID = @courseId
      ORDER BY s.FullName, s.StudentID;
    `);
    if (!result.recordset.length) throw invalid('Course not found.', 404);
    res.json(result.recordset.filter((student) => student.id !== null));
  });

  router.post('/:courseId/enrollments', async (req, res) => {
    const courseId = positiveId(req.params.courseId, 'Course ID');
    const studentId = positiveId(req.body?.studentId, 'Student ID');
    const outcome = await enroll(pool, sql, courseId, studentId);
    if (outcome === 'already-enrolled') throw invalid('This student is already enrolled in the course.', 409);
    res.status(outcome === 'created' ? 201 : 200).json({ courseId, studentId, outcome });
  });

  router.delete('/:courseId/enrollments/:studentId', async (req, res) => {
    const courseId = positiveId(req.params.courseId, 'Course ID');
    const studentId = positiveId(req.params.studentId, 'Student ID');
    const result = await pool.request()
      .input('courseId', sql.Int, courseId)
      .input('studentId', sql.Int, studentId)
      .query(`
        UPDATE dbo.Enrollments SET IsActive = 0
        OUTPUT inserted.EnrollmentID AS id
        WHERE StudentID = @studentId AND CourseID = @courseId;
      `);
    if (!result.recordset.length) throw invalid('Enrollment not found.', 404);
    res.status(204).end();
  });

  router.use((error, req, res, next) => {
    if (error.number === 2601 || error.number === 2627) {
      return res.status(409).json({ error: 'That course code already exists.' });
    }
    next(error);
  });

  return router;
}

module.exports = { courseRouter };
