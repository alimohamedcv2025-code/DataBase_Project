USE [master];
GO

IF DB_ID(N'StudentAttendance') IS NULL
    EXEC (N'CREATE DATABASE [StudentAttendance];');
GO

USE [StudentAttendance];
GO

SET XACT_ABORT ON;
BEGIN TRANSACTION;

IF OBJECT_ID(N'dbo.Students', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Students
    (
        StudentID int IDENTITY(1, 1) NOT NULL,
        StudentCode nvarchar(20) NOT NULL,
        FullName nvarchar(120) NOT NULL,
        Email nvarchar(254) NULL,
        Department nvarchar(100) NULL,
        [Level] tinyint NULL,
        CONSTRAINT PK_Students PRIMARY KEY (StudentID),
        CONSTRAINT UQ_Students_StudentCode UNIQUE (StudentCode),
        CONSTRAINT CK_Students_StudentCode CHECK (LEN(LTRIM(StudentCode)) > 0),
        CONSTRAINT CK_Students_FullName CHECK (LEN(LTRIM(FullName)) > 0),
        CONSTRAINT CK_Students_Level CHECK ([Level] >= 1)
    );
END;

IF OBJECT_ID(N'dbo.Courses', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Courses
    (
        CourseID int IDENTITY(1, 1) NOT NULL,
        CourseCode nvarchar(20) NOT NULL,
        CourseName nvarchar(120) NOT NULL,
        InstructorName nvarchar(120) NULL,
        CONSTRAINT PK_Courses PRIMARY KEY (CourseID),
        CONSTRAINT UQ_Courses_CourseCode UNIQUE (CourseCode),
        CONSTRAINT CK_Courses_CourseCode CHECK (LEN(LTRIM(CourseCode)) > 0),
        CONSTRAINT CK_Courses_CourseName CHECK (LEN(LTRIM(CourseName)) > 0)
    );
END;

IF OBJECT_ID(N'dbo.Enrollments', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Enrollments
    (
        EnrollmentID int IDENTITY(1, 1) NOT NULL,
        StudentID int NOT NULL,
        CourseID int NOT NULL,
        IsActive bit NOT NULL CONSTRAINT DF_Enrollments_IsActive DEFAULT (1),
        CONSTRAINT PK_Enrollments PRIMARY KEY (EnrollmentID),
        CONSTRAINT UQ_Enrollments_Student_Course UNIQUE (StudentID, CourseID),
        CONSTRAINT FK_Enrollments_Students FOREIGN KEY (StudentID)
            REFERENCES dbo.Students (StudentID) ON DELETE NO ACTION,
        CONSTRAINT FK_Enrollments_Courses FOREIGN KEY (CourseID)
            REFERENCES dbo.Courses (CourseID) ON DELETE NO ACTION
    );

    CREATE INDEX IX_Enrollments_Course_Active_Student
        ON dbo.Enrollments (CourseID, IsActive, StudentID);
END;

IF OBJECT_ID(N'dbo.Attendance', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Attendance
    (
        AttendanceID int IDENTITY(1, 1) NOT NULL,
        StudentID int NOT NULL,
        CourseID int NOT NULL,
        AttendanceDate date NOT NULL,
        [Status] varchar(7) COLLATE Latin1_General_100_BIN2 NOT NULL,
        CONSTRAINT PK_Attendance PRIMARY KEY (AttendanceID),
        CONSTRAINT UQ_Attendance_Student_Course_Date
            UNIQUE (StudentID, CourseID, AttendanceDate),
        CONSTRAINT FK_Attendance_Enrollments FOREIGN KEY (StudentID, CourseID)
            REFERENCES dbo.Enrollments (StudentID, CourseID) ON DELETE NO ACTION,
        CONSTRAINT CK_Attendance_Status CHECK
        (
            [Status] IN ('Present', 'Absent', 'Late')
            AND DATALENGTH([Status]) = LEN([Status])
        )
    );

    CREATE INDEX IX_Attendance_Course_Date
        ON dbo.Attendance (CourseID, AttendanceDate, StudentID)
        INCLUDE ([Status]);
END;
GO

CREATE OR ALTER TRIGGER dbo.TR_Attendance_RequireActiveEnrollment
ON dbo.Attendance
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    -- Hold the enrollment read until the save commits to serialize withdrawal and attendance.
    IF EXISTS
    (
        SELECT 1
        FROM inserted AS i
        JOIN dbo.Enrollments AS e WITH (HOLDLOCK)
            ON e.StudentID = i.StudentID AND e.CourseID = i.CourseID
        WHERE e.IsActive = 0
    )
        THROW 50001, 'Attendance requires an active enrollment.', 1;
END;
GO

COMMIT TRANSACTION;
GO
