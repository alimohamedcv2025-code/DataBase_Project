# Kareem Wael — T2 Analysis & ERD

- **Branch:** `feature/T2-erd`
- **Reviewer:** Ali Mohamed + Kerolos Eissa
- **Deliverables:** `docs/ERD.png` (or PDF) matching the PRD and the SQL schema.

## Week 1 — Planning & Setup (SAME FOR EVERYONE — no building yet)

> Goal: everyone understands the project, the environment is ready, and the plan is agreed before any real building starts.

- [ ] **1. Read the PRD.** Read `docs/PRD_Student_Attendance_System.md` fully (requirements FR-01..FR-08, data model, test cases TC-01..TC-07). Why: it is the single source of truth. Done when: you can explain the 4 tables and the 3 attendance statuses.
- [ ] **2. Read the tech decisions.** Read `docs/TECH_DECISIONS.md` (SQL Server + React + Express, Update+message policy). Why: to avoid re-discussing locked decisions. Done when: you can explain the stack and the duplicate policy.
- [ ] **3. Set up your local environment.** Install: SQL Server (local instance) + SSMS or Azure Data Studio, Node.js LTS, Git. Why: every member must run the project locally. Done when: `sqlcmd` connects to your instance and `node -v` works.
- [ ] **4. Clone the repo and create your branch.** Clone `DataBase_Project`, checkout `feature/T2-erd`, push it once to link it. Why: all work happens in task branches. Done when: your branch is visible on GitHub.
- [ ] **5. Join the planning sync.** Agree with the team on: branch names, commit style, daily meeting time, reviewer pairs. Why: prevents merge chaos later. Done when: decisions are written in your `WORKLOG.md`.
- [ ] **6. Draft the entity list for team review.** Extract entities, attributes, keys, and relationships from the PRD (Students, Courses, Enrollments, Attendance, Users-optional) and share a draft table. Why: the ERD must be reviewed before drawing. Done when: the draft is in your branch or WORKLOG.
- [ ] **7. Write your Week 2 build plan.** In `WORKLOG.md`, list the exact ERD version and review dates. Done when: the plan table is filled.

## Week 2+ — ERD Build & Alignment (T2 specific)

- [ ] **1. Draw the full ERD.** Include all entities, PKs, FKs, UNIQUE constraints, and `Status IN (Present, Absent, Late)`. Why: it is the contract for the database. Done when: `docs/ERD.png` is in your branch.
- [ ] **2. Align ERD with the SQL schema (T3).** Walk through the ERD with Kerolos table by table until it matches `01_schema.sql` exactly. Why: any mismatch breaks the build. Done when: Kerolos approves the ERD.
- [ ] **3. Get T1 approval and merge.** Request review from Ali, fix comments, merge to `main`. Why: the ERD is a required submission artifact. Done when: ERD is on `main` and matches PRD + schema.
- [ ] **4. Support T8 documentation.** Provide the final ERD source plus a one-paragraph explanation for the final report. Why: T8 needs it for submission docs. Done when: Sherina confirms she has what she needs.

## Definition of Done
ERD on `main` in `docs/`, matching PRD and SQL schema, approved by T1 and T3.
