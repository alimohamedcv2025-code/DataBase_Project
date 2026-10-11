# Sherina Ahmed — T8 Reports, Testing & Documentation

- **Branch:** `feature/T8-reports-testing-docs`
- **Reviewer:** Ali Mohamed
- **Deliverables:** History/reports verification + test evidence + final docs.

## Week 1 — Planning & Setup (SAME FOR EVERYONE — no building yet)

> Goal: everyone understands the project, the environment is ready, and the plan is agreed before any real building starts.

- [ ] **1. Read the PRD.** Read `docs/PRD_Student_Attendance_System.md` fully (requirements FR-01..FR-08, data model, test cases TC-01..TC-07). Why: it is the single source of truth. Done when: you can explain the 4 tables and the 3 attendance statuses.
- [ ] **2. Read the tech decisions.** Read `docs/TECH_DECISIONS.md` (SQL Server + React + Express, Update+message policy). Why: to avoid re-discussing locked decisions. Done when: you can explain the stack and the duplicate policy.
- [ ] **3. Set up your local environment.** Install: SQL Server (local instance) + SSMS or Azure Data Studio, Node.js LTS, Git. Why: every member must run the project locally. Done when: `sqlcmd` connects to your instance and `node -v` works.
- [ ] **4. Clone the repo and create your branch.** Clone `DataBase_Project`, checkout `feature/T8-reports-testing-docs`, push it once to link it. Why: all work happens in task branches. Done when: your branch is visible on GitHub.
- [ ] **5. Join the planning sync.** Agree with the team on: branch names, commit style, daily meeting time, reviewer pairs. Why: prevents merge chaos later. Done when: decisions are written in your `WORKLOG.md`.
- [ ] **6. Draft the test-evidence template.** Create a table for TC-01..TC-07 with columns: steps, expected, actual, pass/fail, screenshot, date. Why: evidence must be collected uniformly from Week 2 on. Done when: the template is in your branch.
- [ ] **7. Agree the report formula with the team.** Confirm: percentage base, and whether Late counts as present. Why: TC-06 cannot pass without an agreed formula. Done when: the formula is written in your WORKLOG and TECH_DECISIONS.

## Week 2+ — Reports, Testing & Docs (T8 specific)

- [ ] **1. Verify history filters (FR-06).** Student + course + date-range filters return exactly the DB rows. Why: filtered accuracy is the acceptance criterion. Done when: spot-checks against raw SQL all match.
- [ ] **2. Verify report math (TC-06, FR-07).** Totals and percentages in the UI match direct SQL counts on the same seed data. Why: reports are a graded deliverable. Done when: TC-06 recorded passing with screenshots.
- [ ] **3. Execute and record TC-01..TC-07.** Run every case with each owner, capture pass/fail + screenshots + dates. Why: required test evidence for submission. Done when: the full table is complete.
- [ ] **4. Assemble final docs.** Screenshots of every screen, test results, ERD, and a verified README run guide with Ali. Why: Definition of Done requires complete docs in the repo. Done when: `docs/` + README are submission-ready.

## Definition of Done
Reports match the DB exactly, all 7 test cases executed with evidence, docs complete in the repo.
