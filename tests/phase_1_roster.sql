USE [StudentAttendance];
GO

-- On a freshly seeded database, expect 50 students, 5 courses, 100 enrollments,
-- and 400 attendance records.
SELECT
    (SELECT COUNT(*) FROM dbo.Students) AS Students,
    (SELECT COUNT(*) FROM dbo.Courses) AS Courses,
    (SELECT COUNT(*) FROM dbo.Enrollments) AS Enrollments,
    (SELECT COUNT(*) FROM dbo.Attendance) AS AttendanceRecords;

-- Change the course and date here to inspect a different roster.
-- DEMO-DB has 20 enrolled students after seeding. A date without recorded
-- attendance still shows the roster, with NULL statuses.
DECLARE @CourseCode nvarchar(20) = N'DEMO-DB';
DECLARE @AttendanceDate date = DATEFROMPARTS(2026, 11, 1);

SELECT
    s.StudentID,
    s.StudentCode,
    s.FullName,
    c.CourseCode,
    c.CourseName,
    @AttendanceDate AS AttendanceDate,
    a.[Status]
FROM dbo.Courses AS c
JOIN dbo.Enrollments AS e ON e.CourseID = c.CourseID AND e.IsActive = 1
JOIN dbo.Students AS s ON s.StudentID = e.StudentID
LEFT JOIN dbo.Attendance AS a
    ON a.StudentID = e.StudentID
    AND a.CourseID = e.CourseID
    AND a.AttendanceDate = @AttendanceDate
WHERE c.CourseCode = @CourseCode
ORDER BY s.StudentCode;
GO
