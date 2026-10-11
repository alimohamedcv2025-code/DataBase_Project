# Abdullah Amr — T4 Student Management UI (React)

- **Branch:** `feature/T4-student-management`
- **Reviewer:** Ali Mohamed
- **Deliverables:** Student CRUD screen in `client/` wired to the API.

## Week 1 — Planning & Setup (SAME FOR EVERYONE — no building yet)

> Goal: everyone understands the project, the environment is ready, and the plan is agreed before any real building starts.

- [ ] **1. Read the PRD.** Read `docs/PRD_Student_Attendance_System.md` fully (requirements FR-01..FR-08, data model, test cases TC-01..TC-07). Why: it is the single source of truth. Done when: you can explain the 4 tables and the 3 attendance statuses.
- [ ] **2. Read the tech decisions.** Read `docs/TECH_DECISIONS.md` (SQL Server + React + Express, Update+message policy). Why: to avoid re-discussing locked decisions. Done when: you can explain the stack and the duplicate policy.
- [ ] **3. Set up your local environment.** Install: SQL Server (local instance) + SSMS or Azure Data Studio, Node.js LTS, Git. Why: every member must run the project locally. Done when: `sqlcmd` connects to your instance and `node -v` works.
- [ ] **4. Clone the repo and create your branch.** Clone `DataBase_Project`, checkout `feature/T4-student-management`, push it once to link it. Why: all work happens in task branches. Done when: your branch is visible on GitHub.
- [ ] **5. Join the planning sync.** Agree with the team on: branch names, commit style, daily meeting time, reviewer pairs. Why: prevents merge chaos later. Done when: decisions are written in your `WORKLOG.md`.
- [ ] **6. Review the Students table draft (T3).** Confirm you know every column you will display: StudentCode, FullName, Email, Department, Level. Why: your form depends on the schema. Done when: you leave feedback to Kerolos.
- [ ] **7. Write your Week 2 build plan.** In `WORKLOG.md`, sketch your screen (form fields + table columns + search box) and the API endpoints you need. Done when: the sketch is written down.

## Week 2+ — Student Screen Build (T4 specific)

- [ ] **1. Build the list + search.** Table of students with search by name or StudentCode (FR-01). Why: primary lookup for the demo. Done when: search filters correctly on seed data.
- [ ] **2. Wire Create / Update / Delete to the API.** Each action calls the backend and refreshes the list. Why: full CRUD is required. Done when: all three actions persist in the DB.
- [ ] **3. Add validation and clear messages (FR-08).** Required-field checks before save; show success, duplicate-code rejection (TC-02), and delete-blocked message (TC-07). Why: every operation must give feedback. Done when: invalid data never saves and messages are clear.
- [ ] **4. Prove TC-01, TC-02, TC-07 with T8.** New code creates (TC-01), existing code is rejected (TC-02), student with records cannot be deleted silently (TC-07). Done when: Sherina records all three as passing.

## Definition of Done
Student CRUD + search works, duplicate codes rejected, referential integrity protected, all with clear messages.
