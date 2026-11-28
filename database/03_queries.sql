USE [StudentAttendance];
GO

-- Adjust these parameters before executing the script.
DECLARE @Search nvarchar(120) = N'Ahmed';
DECLARE @StudentCode nvarchar(20) = NULL;
DECLARE @CourseCode nvarchar(20) = N'DEMO-DB';
DECLARE @RosterDate date = DATEFROMPARTS(2026, 11, 1);
DECLARE @FromDate date = DATEFROMPARTS(2026, 11, 1);
DECLARE @ToDate date = DATEFROMPARTS(2026, 11, 4);

IF @FromDate > @ToDate
    THROW 50012, 'Start date must be on or before the end date.', 1;

-- Search students by name or code. An empty search returns all students.
SELECT StudentID, StudentCode, FullName, Email, Department, [Level]
FROM dbo.Students
WHERE @Search = N'' OR CHARINDEX(@Search, StudentCode) > 0 OR CHARINDEX(@Search, FullName) > 0
ORDER BY FullName, StudentID;

-- Current class roster and saved status on the selected date.
-- An unmarked student has NULL status.
SELECT c.CourseCode, s.StudentCode, s.FullName, @RosterDate AS AttendanceDate, a.[Status]
FROM dbo.Enrollments AS e
JOIN dbo.Courses AS c ON c.CourseID = e.CourseID
JOIN dbo.Students AS s ON s.StudentID = e.StudentID
LEFT JOIN dbo.Attendance AS a ON a.StudentID = e.StudentID AND a.CourseID = e.CourseID
                             AND a.AttendanceDate = @RosterDate
WHERE e.IsActive = 1 AND c.CourseCode = @CourseCode
ORDER BY s.FullName, s.StudentID;

-- History includes attendance recorded before a student withdrew from a course.
-- Set a history filter to NULL to omit it.
DECLARE @History TABLE
(
    AttendanceID int PRIMARY KEY,
    AttendanceDate date NOT NULL,
    StudentCode nvarchar(20) NOT NULL,
    FullName nvarchar(120) NOT NULL,
    CourseCode nvarchar(20) NOT NULL,
    CourseName nvarchar(120) NOT NULL,
    [Status] varchar(7) NOT NULL
);

INSERT @History
SELECT a.AttendanceID, a.AttendanceDate, s.StudentCode, s.FullName, c.CourseCode, c.CourseName, a.[Status]
FROM dbo.Attendance AS a
JOIN dbo.Students AS s ON a.StudentID = s.StudentID
JOIN dbo.Courses AS c ON a.CourseID = c.CourseID
WHERE (@StudentCode IS NULL OR s.StudentCode = @StudentCode)
  AND (@CourseCode IS NULL OR c.CourseCode = @CourseCode)
  AND (@FromDate IS NULL OR a.AttendanceDate >= @FromDate)
  AND (@ToDate IS NULL OR a.AttendanceDate <= @ToDate);

SELECT AttendanceDate, StudentCode, FullName, CourseCode, CourseName, [Status]
FROM @History
ORDER BY AttendanceDate DESC, AttendanceID DESC;

-- Each percentage is a share of all recorded statuses in the filtered history.
WITH Totals AS
(
    SELECT COUNT(*) AS Total, COUNT(CASE WHEN [Status] = 'Present' THEN 1 END) AS Present,
           COUNT(CASE WHEN [Status] = 'Absent' THEN 1 END) AS Absent,
           COUNT(CASE WHEN [Status] = 'Late' THEN 1 END) AS Late
    FROM @History
)
SELECT Total, Present, Absent, Late,
       COALESCE(CAST(100.0 * Present / NULLIF(Total, 0) AS decimal(5, 1)), 0) AS PresentPercent,
       COALESCE(CAST(100.0 * Absent / NULLIF(Total, 0) AS decimal(5, 1)), 0) AS AbsentPercent,
       COALESCE(CAST(100.0 * Late / NULLIF(Total, 0) AS decimal(5, 1)), 0) AS LatePercent
FROM Totals;
GO
