# DataBase_Project - Student Attendance Management System

Database course project for managing students, courses, enrollments, and daily attendance.

## Docs

- [PRD_Student_Attendance_System.md](docs/PRD_Student_Attendance_System.md)
- [Technical decisions](docs/TECH_DECISIONS.md)
- [Database ERD](docs/ERD.png) ([editable Graphviz source](docs/ERD.dot))

## Tech Stack (locked)

- **Database:** SQL Server
- **Backend:** Node.js + Express (`mssql` driver)
- **Frontend:** React (Vite)
- Runs locally without internet access.

## Key Decisions (locked)

- **Duplicate attendance** (same student + course + date): **Update** existing record + show message to user.
- **Delete policy:** RESTRICT — cannot delete a student/course with related records; show clear message.

## Phase 1 — Database setup

1. Connect to a local SQL Server 2016 SP1 or later instance in SQL Server Management Studio (SSMS). Use a login that can create the `StudentAttendance` database and its schema.
2. Run [`database/01_schema.sql`](database/01_schema.sql), then [`database/02_seed_data.sql`](database/02_seed_data.sql), against the same instance. Each script selects the database it needs.
3. Run [`tests/phase_1_roster.sql`](tests/phase_1_roster.sql). A freshly seeded database has 50 students, 5 courses, 100 enrollments, and 400 attendance records. The default query returns 20 enrolled students in Database Systems for November 1, 2026. Try a date outside November 1–4 to see the roster before attendance has been recorded.

On Windows, the same steps can run from the repository root with `sqlcmd` and Windows Authentication. Replace `localhost` with your instance name if needed.

```powershell
sqlcmd -S localhost -E -b -i database/01_schema.sql
sqlcmd -S localhost -E -b -i database/02_seed_data.sql
sqlcmd -S localhost -E -b -i tests/phase_1_roster.sql
```

The schema script supports reruns on the Phase 1 schema. The seed script adds missing demo rows and preserves existing values.

### Enrollment and attendance

- Each student and course pair has one enrollment. Removing an enrollment means setting `IsActive = 0`. Re-enrolling sets it back to `1`.
- Attendance references the enrollment's student and course pair, so deactivation keeps historical attendance and takes the student off the current roster. The database rejects attendance saves against an inactive enrollment.
- The database enforces the unique attendance key. The attendance API will use that key to update an existing record and return the user-facing message.

## Planned structure

```text
 student-attendance-system/
 ├── database/      # Schema and seed; report queries will follow
 ├── server/        # Node + Express API (planned)
 ├── client/        # React (Vite) frontend (planned)
 ├── docs/
 │   ├── PRD_Student_Attendance_System.md
 │   ├── TECH_DECISIONS.md
 │   └── ERD.png
 ├── tests/         # Phase 1 roster verification
 └── README.md
```
