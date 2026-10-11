# Shimaa Abdelghani — T6 Attendance Business Logic (API)

- **Branch:** `feature/T6-attendance-logic`
- **Reviewer:** Salma Mohamed
- **Deliverables:** Attendance endpoints in `server/` with validation and upsert logic.

## Week 1 — Planning & Setup (SAME FOR EVERYONE — no building yet)

> Goal: everyone understands the project, the environment is ready, and the plan is agreed before any real building starts.

- [ ] **1. Read the PRD.** Read `docs/PRD_Student_Attendance_System.md` fully (requirements FR-01..FR-08, data model, test cases TC-01..TC-07). Why: it is the single source of truth. Done when: you can explain the 4 tables and the 3 attendance statuses.
- [ ] **2. Read the tech decisions.** Read `docs/TECH_DECISIONS.md` (SQL Server + React + Express, Update+message policy). Why: to avoid re-discussing locked decisions. Done when: you can explain the stack and the duplicate policy.
- [ ] **3. Set up your local environment.** Install: SQL Server (local instance) + SSMS or Azure Data Studio, Node.js LTS, Git. Why: every member must run the project locally. Done when: `sqlcmd` connects to your instance and `node -v` works.
- [ ] **4. Clone the repo and create your branch.** Clone `DataBase_Project`, checkout `feature/T6-attendance-logic`, push it once to link it. Why: all work happens in task branches. Done when: your branch is visible on GitHub.
- [ ] **5. Join the planning sync.** Agree with the team on: branch names, commit style, daily meeting time, reviewer pairs. Why: prevents merge chaos later. Done when: decisions are written in your `WORKLOG.md`.
- [ ] **6. Review the Attendance table draft (T3).** Confirm the `UNIQUE(StudentID, CourseID, AttendanceDate)` rule and the Status CHECK you must enforce. Why: your endpoints implement these rules. Done when: you leave feedback to Kerolos.
- [ ] **7. Write your Week 2 build plan.** In `WORKLOG.md`, list your endpoints (`POST /attendance`, `GET /attendance`, etc.) and the upsert behavior. Done when: the endpoint list is written down.

## Week 2+ — Attendance Logic Build (T6 specific)

- [ ] **1. Implement `POST /attendance` (upsert).** Input: StudentID + CourseID + AttendanceDate + Status. If no record exists, INSERT; if one exists, UPDATE Status and return message "already existed — updated from X to Y". Why: this is the locked duplicate policy (TC-04). Done when: double-save updates exactly one row with a clear message.
- [ ] **2. Reject attendance for non-enrolled students (TC-05).** Check Enrollments before insert/update; reject with a clear message when no enrollment exists. Why: required business rule. Done when: TC-05 fails cleanly with a message and writes nothing.
- [ ] **3. Validate Status and required fields (FR-08).** Accept only Present/Absent/Late; reject missing StudentID/CourseID/date. Why: invalid data must never save. Done when: every invalid input returns a clear error and writes nothing.
- [ ] **4. Expose history/report queries.** `GET /attendance?studentId&courseId&from&to` plus summary totals/percentages backed by `03_queries.sql`. Why: T7 and T8 depend on these. Done when: Salma and Sherina confirm the responses match the DB (TC-06 logic).

## Definition of Done
No duplicate or non-enrolled record is ever saved; every outcome returns a clear message; responses stay under 2s on seed data.
