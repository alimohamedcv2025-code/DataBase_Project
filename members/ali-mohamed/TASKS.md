# Ali Mohamed — T1 Team Lead & Integration

- **Branch:** `feature/T1-integration`
- **Reviewer:** Kareem Wael
- **Deliverables:** Repo structure + `README.md` + final integration + daily coordination.

## Week 1 — Planning & Setup (SAME FOR EVERYONE — no building yet)

> Goal: everyone understands the project, the environment is ready, and the plan is agreed before any real building starts.

- [ ] **1. Read the PRD.** Read `docs/PRD_Student_Attendance_System.md` fully (requirements FR-01..FR-08, data model, test cases TC-01..TC-07). Why: it is the single source of truth. Done when: you can explain the 4 tables and the 3 attendance statuses.
- [ ] **2. Read the tech decisions.** Read `docs/TECH_DECISIONS.md` (SQL Server + React + Express, Update+message policy). Why: to avoid re-discussing locked decisions. Done when: you can explain the stack and the duplicate policy.
- [ ] **3. Set up your local environment.** Install: SQL Server (local instance) + SSMS or Azure Data Studio, Node.js LTS, Git. Why: every member must run the project locally. Done when: `sqlcmd` connects to your instance and `node -v` works.
- [ ] **4. Clone the repo and create your branch.** Clone `DataBase_Project`, checkout `feature/T1-integration`, push it once to link it. Why: all work happens in task branches. Done when: your branch is visible on GitHub.
- [ ] **5. Join the planning sync.** Agree with the team on: branch names, commit style, daily meeting time, reviewer pairs. Why: prevents merge chaos later. Done when: decisions are written in your `WORKLOG.md`.
- [ ] **6. Review the ERD draft (by T2) and the schema draft (by T3).** Leave at least 2 comments or approvals. Why: T1 must approve both before building. Done when: your review is recorded (comment or WORKLOG entry).
- [ ] **7. Write your Week 2 build plan.** In `WORKLOG.md`, list the exact files you will create in Week 2. Why: forces clear scope. Done when: the plan table is filled.

## Week 2+ — Integration & Delivery (T1 specific)

- [ ] **1. Create the base folder structure.** Create `database/`, `server/`, `client/`, `tests/` with placeholder `.gitkeep` files. Why: so all members have stable paths to work against. Done when: structure is merged to `main`.
- [ ] **2. Enforce branch workflow.** Verify every member pushes only to their `feature/Tx-...` branch and opens review before merge. Why: keeps `main` always demoable. Done when: no direct pushes to `main`.
- [ ] **3. Integrate T2–T8 work.** Merge approved branches, resolve conflicts, keep the app running after each merge. Why: integration is T1's core deliverable. Done when: `main` contains all approved work and still runs.
- [ ] **4. Finalize the README run guide.** Document: how to create the DB, run the API, run React, all locally. Why: the demo machine setup depends on it. Done when: a fresh machine can run the project using only the README.
- [ ] **5. Run the offline demo rehearsal.** Full flow on the presentation device without internet: students → courses → enrollments → attendance → reports. Why: catches last-minute environment issues. Done when: rehearsal passes with seed data.

## Definition of Done
`main` builds from scratch via README, all branches merged, offline demo works.
