# DataBase_Project - Student Attendance Management System

Database course project for managing students, courses, enrollments, and daily attendance.

## Docs

- [PRD_Student_Attendance_System.md](docs/PRD_Student_Attendance_System.md)

## Tech Stack (locked)

- **Database:** SQL Server
- **Backend:** Node.js + Express (`mssql` driver)
- **Frontend:** React (Vite)
- Runs locally without internet access.

## Key Decisions (locked)

- **Duplicate attendance** (same student + course + date): **Update** existing record + show message to user.
- **Delete policy:** RESTRICT — cannot delete a student/course with related records; show clear message.

## Planned structure

```text
 student-attendance-system/
 ├── database/      # 01_schema.sql, 02_seed_data.sql, 03_queries.sql
 ├── server/        # Node + Express API (SQL Server)
 ├── client/        # React (Vite) frontend
 ├── docs/
 │   ├── PRD_Student_Attendance_System.md
 │   ├── TECH_DECISIONS.md
 │   └── ERD.png
 ├── tests/
 └── README.md
```
