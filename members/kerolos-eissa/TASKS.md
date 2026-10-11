# Kerolos Eissa — T3 Database Development (SQL Server)

- **Branch:** `feature/T3-database`
- **Reviewer:** Kareem Wael + Ali Mohamed
- **Deliverables:** `database/01_schema.sql`, `02_seed_data.sql`, `03_queries.sql` (SQL Server).

## Week 1 — Planning & Setup (SAME FOR EVERYONE — no building yet)

> Goal: everyone understands the project, the environment is ready, and the plan is agreed before any real building starts.

- [ ] **1. Read the PRD.** Read `docs/PRD_Student_Attendance_System.md` fully (requirements FR-01..FR-08, data model, test cases TC-01..TC-07). Why: it is the single source of truth. Done when: you can explain the 4 tables and the 3 attendance statuses.
- [ ] **2. Read the tech decisions.** Read `docs/TECH_DECISIONS.md` (SQL Server + React + Express, Update+message policy). Why: to avoid re-discussing locked decisions. Done when: you can explain the stack and the duplicate policy.
- [ ] **3. Set up your local environment.** Install: SQL Server (local instance) + SSMS or Azure Data Studio, Node.js LTS, Git. Why: every member must run the project locally. Done when: `sqlcmd` connects to your instance and `node -v` works.
- [ ] **4. Clone the repo and create your branch.** Clone `DataBase_Project`, checkout `feature/T3-database`, push it once to link it. Why: all work happens in task branches. Done when: your branch is visible on GitHub.
- [ ] **5. Join the planning sync.** Agree with the team on: branch names, commit style, daily meeting time, reviewer pairs. Why: prevents merge chaos later. Done when: decisions are written in your `WORKLOG.md`.
- [ ] **6. Draft the table list for team review.** List the 4 tables with columns, PKs, FKs, and UNIQUE rules from PRD §10 and share it for feedback. Why: schema must be agreed before coding. Done when: T2 confirms it matches the ERD direction.
- [ ] **7. Write your Week 2 build plan.** In `WORKLOG.md`, list the 3 SQL files and the seed volumes you will produce. Done when: the plan table is filled.

## Week 2+ — Database Build (T3 specific)

- [ ] **1. Write `01_schema.sql`.** Create database + tables + PK/FK + `UNIQUE(StudentCode)`, `UNIQUE(CourseCode)`, `UNIQUE(StudentID, CourseID)` on Enrollments, `UNIQUE(StudentID, CourseID, AttendanceDate)` on Attendance, `CHECK (Status IN ('Present','Absent','Late'))`. Use SQL Server syntax. Why: this is the core deliverable. Done when: it runs clean on an empty instance.
- [ ] **2. Write `02_seed_data.sql`.** Insert 50+ students, 5 courses, enrollments, and 300–500 attendance rows. Why: the demo needs realistic volume. Done when: counts verified with `SELECT COUNT(*)`.
- [ ] **3. Write `03_queries.sql`.** Cover: search by name/code, student history with course+date filters, attendance/absence/late totals and percentages. Why: baseline for API and reports. Done when: every query runs and returns correct results on seed data.
- [ ] **4. Prove a from-scratch build.** Drop the DB, re-run `01` then `02` then `03` with zero manual edits. Why: Definition of Done requires it. Done when: full rebuild succeeds twice in a row.
- [ ] **5. Support the API owner (T6).** Confirm connection details (`mssql` config) and any constraint error codes T6 must handle. Done when: Shimaa confirms she can connect and handle UNIQUE violations.

## Definition of Done
All 3 SQL files on `main`, from-scratch rebuild works, seed is sufficient for demo.
