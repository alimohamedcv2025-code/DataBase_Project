# Shahd Mourad — T5 Course & Enrollment UI (React)

- **Branch:** `feature/T5-course-enrollment`
- **Reviewer:** Ali Mohamed
- **Deliverables:** Course screen + Enrollment screen in `client/`.

## Week 1 — Planning & Setup (SAME FOR EVERYONE — no building yet)

> Goal: everyone understands the project, the environment is ready, and the plan is agreed before any real building starts.

- [ ] **1. Read the PRD.** Read `docs/PRD_Student_Attendance_System.md` fully (requirements FR-01..FR-08, data model, test cases TC-01..TC-07). Why: it is the single source of truth. Done when: you can explain the 4 tables and the 3 attendance statuses.
- [ ] **2. Read the tech decisions.** Read `docs/TECH_DECISIONS.md` (SQL Server + React + Express, Update+message policy). Why: to avoid re-discussing locked decisions. Done when: you can explain the stack and the duplicate policy.
- [ ] **3. Set up your local environment.** Install: SQL Server (local instance) + SSMS or Azure Data Studio, Node.js LTS, Git. Why: every member must run the project locally. Done when: `sqlcmd` connects to your instance and `node -v` works.
- [ ] **4. Clone the repo and create your branch.** Clone `DataBase_Project`, checkout `feature/T5-course-enrollment`, push it once to link it. Why: all work happens in task branches. Done when: your branch is visible on GitHub.
- [ ] **5. Join the planning sync.** Agree with the team on: branch names, commit style, daily meeting time, reviewer pairs. Why: prevents merge chaos later. Done when: decisions are written in your `WORKLOG.md`.
- [ ] **6. Review the Courses + Enrollments drafts (T3).** Confirm CourseCode uniqueness and the `UNIQUE(StudentID, CourseID)` rule you must enforce in UI. Why: your screens depend on these constraints. Done when: you leave feedback to Kerolos.
- [ ] **7. Write your Week 2 build plan.** In `WORKLOG.md`, sketch both screens and the endpoints you need. Done when: the sketch is written down.

## Week 2+ — Course & Enrollment Build (T5 specific)

- [ ] **1. Build the Course CRUD screen.** Fields: CourseCode, CourseName, InstructorName. Reject duplicate CourseCode with a clear message (FR-02). Why: courses are the second core entity. Done when: duplicate codes are rejected end to end.
- [ ] **2. Build the Enrollment screen.** Student picker + course picker + enroll/remove actions + per-course student list. Why: enrollments drive the attendance list. Done when: enroll/remove persists and the list is accurate.
- [ ] **3. Enforce duplicate-enrollment prevention.** Surface the `UNIQUE(StudentID, CourseID)` violation as a friendly message instead of a raw error. Why: required by FR-03. Done when: double-enroll shows a clear message and creates nothing.
- [ ] **4. Prove TC-03 with T8.** Enroll a student, then confirm they appear in that course's attendance list. Done when: Sherina records TC-03 as passing.

## Definition of Done
Course CRUD + enrollment flow works, duplicates prevented with clear messages, TC-03 passes.
