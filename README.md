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

## Run the app

Use Node.js 22.12+ (22.x) or Node.js 24+, and complete the Phase 1 database setup. If the database and seed data already exist, go straight to the commands below.

### Start the API (PowerShell)

For Windows Authentication, install Microsoft ODBC Driver 18 for SQL Server and open PowerShell under the same Windows account you use in SSMS.

```powershell
cd server
Copy-Item .env.example .env
npm ci
npm start
```

For a local default SQL Server instance, the example uses `DB_SERVER=localhost`. For a named instance, set `DB_INSTANCE` (for example, `SQLEXPRESS`). To connect to a fixed TCP port, set `DB_PORT` instead of `DB_INSTANCE`. For SQL Server Authentication, set `DB_AUTH=sql`, `DB_USER`, and `DB_PASSWORD` in `.env`, and use the instance's TCP settings.

Open [API health](http://localhost:3001/api/health) to verify the SQL Server connection. [Student records](http://localhost:3001/api/students) returns the student list as JSON.

### Start React (a second PowerShell window)

From the repository root, run:

```powershell
cd client
npm ci
npm run dev
```

Open [Student Management](http://localhost:5173). Read, search, add, edit, and delete students here. A newly added student should still appear after a browser refresh. To test restricted deletion, try deleting one of the demo students already enrolled in courses. If the API port differs from `3001`, set `API_TARGET` in `client/.env` (for example, `API_TARGET=http://127.0.0.1:3002`).

## Courses and enrollments

Use **المواد** to view, add, edit, and delete courses. SQL Server blocks deletion when a course has enrollment or attendance records. Use **التسجيل في المواد** to select a course, view its active roster, and enroll or withdraw a student. Re-enrolling a withdrawn student reactivates the same enrollment. The original attendance records remain available in SQL Server.

The existing Phase 1 database supports this part of the app. If you already have a working `server/.env`, keep using it. After updating the code, restart the API and the client.

## Project structure

```text
 student-attendance-system/
 ├── database/      # Schema and seed; report queries will follow
 ├── server/        # Node + Express API
 ├── client/        # React (Vite) frontend
 ├── docs/
 │   ├── PRD_Student_Attendance_System.md
 │   ├── TECH_DECISIONS.md
 │   └── ERD.png
 ├── tests/         # Phase 1 roster verification
 └── README.md
```
