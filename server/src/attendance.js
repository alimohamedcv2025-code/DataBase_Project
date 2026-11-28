const express = require('express');
const { invalid, positiveId } = require('./validation');

const STATUSES = ['Present', 'Absent', 'Late'];
const PAGE_SIZE = 50;

function attendanceDate(value, label, optional = false) {
  if (value == null && optional) return null;
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value) || value.startsWith('0000')) {
    throw invalid(label + ' must be a valid date in YYYY-MM-DD format.');
  }
  const date = new Date(value + 'T00:00:00.000Z');
  if (!Number.isFinite(date.valueOf()) || date.toISOString().slice(0, 10) !== value) {
    throw invalid(label + ' must be a valid date in YYYY-MM-DD format.');
  }
  return value;
}

function readMarks(marks) {
  if (!Array.isArray(marks) || marks.length === 0 || marks.length > 2000) {
    throw invalid('Send between 1 and 2000 attendance marks.');
  }
  const studentIds = new Set();
  return marks.map((mark) => {
    const studentId = positiveId(mark?.studentId, 'Student ID');
    if (!STATUSES.includes(mark.status)) throw invalid('Status must be Present, Absent, or Late.');
    if (studentIds.has(studentId)) throw invalid('Send only one status per student.');
    studentIds.add(studentId);
    return { studentId, status: mark.status };
  });
}

async function saveMarks(pool, sql, courseId, date, marks) {
  const transaction = pool.transaction();
  await transaction.begin();

  try {
    const result = await transaction.request()
      .input('courseId', sql.Int, courseId)
      .input('date', sql.Char(10), date)
      .input('marksJson', sql.NVarChar(sql.MAX), JSON.stringify(marks))
      .query(`
        SET NOCOUNT ON;
        DECLARE @attendanceDate date = CONVERT(date, @date, 23);
        DECLARE @lockedCourse int;
        DECLARE @marks TABLE
        (
            StudentID int PRIMARY KEY,
            [Status] varchar(7) COLLATE Latin1_General_100_BIN2 NOT NULL
        );

        -- Serialize attendance saves for the same course and hold enrollment reads until commit.
        SELECT @lockedCourse = CourseID
        FROM dbo.Courses WITH (UPDLOCK, HOLDLOCK)
        WHERE CourseID = @courseId;

        IF @lockedCourse IS NULL
            THROW 50010, 'Course not found.', 1;

        INSERT @marks (StudentID, [Status])
        SELECT StudentID, [Status]
        FROM OPENJSON(@marksJson) WITH (StudentID int '$.studentId', [Status] varchar(7) '$.status');

        IF EXISTS
        (
            SELECT 1
            FROM @marks AS m
            LEFT JOIN dbo.Enrollments AS e WITH (HOLDLOCK)
                ON e.StudentID = m.StudentID AND e.CourseID = @courseId
            WHERE e.StudentID IS NULL OR e.IsActive = 0
        )
            THROW 50011, 'All students must have an active enrollment.', 1;

        UPDATE a SET [Status] = m.[Status]
        FROM dbo.Attendance AS a
        JOIN @marks AS m ON m.StudentID = a.StudentID
        WHERE a.CourseID = @courseId AND a.AttendanceDate = @attendanceDate
          AND a.[Status] <> m.[Status];

        DECLARE @updated int = @@ROWCOUNT;

        INSERT dbo.Attendance (StudentID, CourseID, AttendanceDate, [Status])
        SELECT m.StudentID, @courseId, @attendanceDate, m.[Status]
        FROM @marks AS m
        WHERE NOT EXISTS
        (
            SELECT 1 FROM dbo.Attendance AS a WITH (UPDLOCK, HOLDLOCK)
            WHERE a.StudentID = m.StudentID AND a.CourseID = @courseId
              AND a.AttendanceDate = @attendanceDate
        );

        SELECT @@ROWCOUNT AS inserted, @updated AS updated;
      `);
    await transaction.commit();
    const { inserted, updated } = result.recordset[0];
    return { inserted, updated, unchanged: marks.length - inserted - updated };
  } catch (error) {
    await transaction.rollback().catch(() => {});
    if (error.number === 50010) throw invalid('Course not found.', 404);
    if (error.number === 50001 || error.number === 50011) {
      throw invalid('A student is no longer enrolled in this course. Reload the roster before saving.', 409);
    }
    if (error.number === 1205 || error.number === 2601 || error.number === 2627) {
      throw invalid('Attendance changed during this save. Reload the roster and try again.', 409);
    }
    throw error;
  }
}

function attendanceRouter(pool, sql) {
  const router = express.Router();

  router.get('/', async (req, res) => {
    const courseId = req.query.courseId == null ? null : positiveId(req.query.courseId, 'Course ID');
    const studentId = req.query.studentId == null ? null : positiveId(req.query.studentId, 'Student ID');
    const from = attendanceDate(req.query.from, 'Start date', true);
    const to = attendanceDate(req.query.to, 'End date', true);
    const page = req.query.page == null ? 1 : positiveId(req.query.page, 'Page');
    if (from && to && from > to) throw invalid('Start date must be on or before the end date.');

    const result = await pool.request()
      .input('courseId', sql.Int, courseId)
      .input('studentId', sql.Int, studentId)
      .input('from', sql.Char(10), from)
      .input('to', sql.Char(10), to)
      .input('pageSize', sql.Int, PAGE_SIZE)
      .input('offset', sql.BigInt, (page - 1) * PAGE_SIZE)
      .query(`
        SET NOCOUNT ON;

        -- Capture the filtered rows once so totals match the history during concurrent saves.
        DECLARE @history TABLE
        (
            AttendanceID int PRIMARY KEY,
            AttendanceDate date NOT NULL,
            StudentCode nvarchar(20) NOT NULL,
            FullName nvarchar(120) NOT NULL,
            CourseCode nvarchar(20) NOT NULL,
            CourseName nvarchar(120) NOT NULL,
            [Status] varchar(7) NOT NULL
        );

        INSERT @history
        SELECT a.AttendanceID, a.AttendanceDate, s.StudentCode, s.FullName,
               c.CourseCode, c.CourseName, a.[Status]
        FROM dbo.Attendance AS a
        JOIN dbo.Students AS s ON s.StudentID = a.StudentID
        JOIN dbo.Courses AS c ON c.CourseID = a.CourseID
        WHERE (@studentId IS NULL OR a.StudentID = @studentId)
          AND (@courseId IS NULL OR a.CourseID = @courseId)
          AND (@from IS NULL OR a.AttendanceDate >= CONVERT(date, @from, 23))
          AND (@to IS NULL OR a.AttendanceDate <= CONVERT(date, @to, 23));

        SELECT COUNT(*) AS total, COUNT(CASE WHEN [Status] = 'Present' THEN 1 END) AS present,
               COUNT(CASE WHEN [Status] = 'Absent' THEN 1 END) AS absent,
               COUNT(CASE WHEN [Status] = 'Late' THEN 1 END) AS late
        FROM @history;

        SELECT AttendanceID AS id, CONVERT(char(10), AttendanceDate, 23) AS [date],
               StudentCode AS studentCode, FullName AS fullName, CourseCode AS courseCode,
               CourseName AS courseName, [Status] AS [status]
        FROM @history
        ORDER BY AttendanceDate DESC, AttendanceID DESC
        OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY;
      `);

    const [[summary], rows] = result.recordsets;
    const percent = (count) => summary.total ? Math.round(1000 * count / summary.total) / 10 : 0;
    res.json({
      rows, page, pageSize: PAGE_SIZE,
      summary: {
        ...summary,
        presentPercent: percent(summary.present),
        absentPercent: percent(summary.absent),
        latePercent: percent(summary.late),
      },
    });
  });

  router.get('/:courseId/:date', async (req, res) => {
    const courseId = positiveId(req.params.courseId, 'Course ID');
    const date = attendanceDate(req.params.date, 'Attendance date');
    const result = await pool.request().input('courseId', sql.Int, courseId).input('date', sql.Char(10), date).query(`
      SELECT s.StudentID AS studentId, s.StudentCode AS studentCode, s.FullName AS fullName,
             a.[Status] AS [status]
      FROM dbo.Courses AS c
      LEFT JOIN dbo.Enrollments AS e ON e.CourseID = c.CourseID AND e.IsActive = 1
      LEFT JOIN dbo.Students AS s ON s.StudentID = e.StudentID
      LEFT JOIN dbo.Attendance AS a ON a.CourseID = e.CourseID AND a.StudentID = e.StudentID
                                   AND a.AttendanceDate = CONVERT(date, @date, 23)
      WHERE c.CourseID = @courseId
      ORDER BY s.FullName, s.StudentID;
    `);
    if (!result.recordset.length) throw invalid('Course not found.', 404);
    res.json(result.recordset.filter((student) => student.studentId !== null));
  });

  router.put('/:courseId/:date', async (req, res) => {
    const courseId = positiveId(req.params.courseId, 'Course ID');
    const date = attendanceDate(req.params.date, 'Attendance date');
    res.json(await saveMarks(pool, sql, courseId, date, readMarks(req.body?.marks)));
  });

  return router;
}

module.exports = { attendanceRouter };
