USE [StudentAttendance];
GO

SET NOCOUNT ON;
SET XACT_ABORT ON;
BEGIN TRANSACTION;

DECLARE @DemoCourses TABLE
(
    Slot int PRIMARY KEY,
    CourseCode nvarchar(20) NOT NULL,
    CourseName nvarchar(120) NOT NULL,
    InstructorName nvarchar(120) NOT NULL
);

INSERT @DemoCourses (Slot, CourseCode, CourseName, InstructorName)
VALUES
    (0, N'DEMO-DB', N'Database Systems', N'Dr. Hany Adel'),
    (1, N'DEMO-NET', N'Computer Networks', N'Dr. Mona Samir'),
    (2, N'DEMO-OS', N'Operating Systems', N'Dr. Amr Reda'),
    (3, N'DEMO-SE', N'Software Engineering', N'Dr. Dina Nabil'),
    (4, N'DEMO-AI', N'Artificial Intelligence', N'Dr. Sara Omar');

DECLARE @DemoStudents TABLE
(
    StudentNumber int PRIMARY KEY,
    StudentCode nvarchar(20) NOT NULL,
    FullName nvarchar(120) NOT NULL
);

INSERT @DemoStudents (StudentNumber, StudentCode, FullName)
SELECT
    n.StudentNumber,
    CONCAT(N'DEMO-S', RIGHT(CONCAT(N'000', n.StudentNumber), 3)),
    CONCAT(f.FirstName, N' ', l.LastName)
FROM (VALUES
    (0, N'Ahmed'), (1, N'Mariam'), (2, N'Youssef'), (3, N'Nour'),
    (4, N'Omar'), (5, N'Salma'), (6, N'Karim'), (7, N'Farah'),
    (8, N'Ziad'), (9, N'Hana')
) AS f (FirstIndex, FirstName)
CROSS JOIN (VALUES
    (0, N'Adel'), (1, N'Samir'), (2, N'Nabil'), (3, N'Hassan'), (4, N'Kamal')
) AS l (LastIndex, LastName)
CROSS APPLY (VALUES (5 * f.FirstIndex + l.LastIndex + 1)) AS n (StudentNumber);

INSERT dbo.Students (StudentCode, FullName, Email, Department, [Level])
SELECT
    d.StudentCode,
    d.FullName,
    CONCAT(LOWER(d.StudentCode), N'@example.test'),
    N'Computer Science',
    (d.StudentNumber - 1) % 4 + 1
FROM @DemoStudents AS d
WHERE NOT EXISTS
(
    SELECT 1 FROM dbo.Students AS s WHERE s.StudentCode = d.StudentCode
);

INSERT dbo.Courses (CourseCode, CourseName, InstructorName)
SELECT d.CourseCode, d.CourseName, d.InstructorName
FROM @DemoCourses AS d
WHERE NOT EXISTS
(
    SELECT 1 FROM dbo.Courses AS c WHERE c.CourseCode = d.CourseCode
);

-- Give each student two distinct courses and keep the assignment stable on reruns.
DECLARE @DemoEnrollments TABLE
(
    StudentID int NOT NULL,
    CourseID int NOT NULL,
    StudentNumber int NOT NULL,
    CourseSlot int NOT NULL,
    PRIMARY KEY (StudentID, CourseID)
);

INSERT @DemoEnrollments (StudentID, CourseID, StudentNumber, CourseSlot)
SELECT s.StudentID, c.CourseID, ds.StudentNumber, dc.Slot
FROM @DemoStudents AS ds
JOIN dbo.Students AS s ON s.StudentCode = ds.StudentCode
JOIN @DemoCourses AS dc ON dc.Slot IN ((ds.StudentNumber - 1) % 5, (ds.StudentNumber + 1) % 5)
JOIN dbo.Courses AS c ON c.CourseCode = dc.CourseCode;

INSERT dbo.Enrollments (StudentID, CourseID)
SELECT d.StudentID, d.CourseID
FROM @DemoEnrollments AS d
WHERE NOT EXISTS
(
    SELECT 1
    FROM dbo.Enrollments AS e
    WHERE e.StudentID = d.StudentID AND e.CourseID = d.CourseID
);

-- Seed four fixed dates so a rerun leaves previously entered statuses intact.
INSERT dbo.Attendance (StudentID, CourseID, AttendanceDate, [Status])
SELECT
    d.StudentID,
    d.CourseID,
    dates.AttendanceDate,
    CASE
        WHEN sample.Value < 7 THEN 'Present'
        WHEN sample.Value < 9 THEN 'Absent'
        ELSE 'Late'
    END
FROM @DemoEnrollments AS d
JOIN dbo.Enrollments AS e
    ON e.StudentID = d.StudentID AND e.CourseID = d.CourseID
CROSS JOIN (VALUES (0), (1), (2), (3)) AS days (DayOffset)
CROSS APPLY (VALUES
    (DATEADD(day, days.DayOffset, DATEFROMPARTS(2026, 11, 1)))
) AS dates (AttendanceDate)
CROSS APPLY (VALUES
    (((d.StudentNumber - 1) / 5 + d.CourseSlot + days.DayOffset) % 10)
) AS sample (Value)
WHERE e.IsActive = 1
  AND NOT EXISTS
(
    SELECT 1
    FROM dbo.Attendance AS a
    WHERE a.StudentID = d.StudentID
      AND a.CourseID = d.CourseID
      AND a.AttendanceDate = dates.AttendanceDate
);

COMMIT TRANSACTION;
GO
