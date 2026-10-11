# Salma Mohamed — T7 Attendance UI (React)

- **Branch:** `feature/T7-attendance-ui`
- **Reviewer:** Shimaa Abdelghani
- **Deliverables:** Attendance recording screen in `client/`.

## Week 1 — Planning & Setup (SAME FOR EVERYONE — no building yet)

> Goal: everyone understands the project, the environment is ready, and the plan is agreed before any real building starts.

- [ ] **1. Read the PRD.** Read `docs/PRD_Student_Attendance_System.md` fully (requirements FR-01..FR-08, data model, test cases TC-01..TC-07). Why: it is the single source of truth. Done when: you can explain the 4 tables and the 3 attendance statuses.
- [ ] **2. Read the tech decisions.** Read `docs/TECH_DECISIONS.md` (SQL Server + React + Express, Update+message policy). Why: to avoid re-discussing locked decisions. Done when: you can explain the stack and the duplicate policy.
- [ ] **3. Set up your local environment.** Install: SQL Server (local instance) + SSMS or Azure Data Studio, Node.js LTS, Git. Why: every member must run the project locally. Done when: `sqlcmd` connects to your instance and `node -v` works.
- [ ] **4. Clone the repo and create your branch.** Clone `DataBase_Project`, checkout `feature/T7-attendance-ui`, push it once to link it. Why: all work happens in task branches. Done when: your branch is visible on GitHub.
- [ ] **5. Join the planning sync.** Agree with the team on: branch names, commit style, daily meeting time, reviewer pairs. Why: prevents merge chaos later. Done when: decisions are written in your `WORKLOG.md`.
- [ ] **6. Review the T6 endpoint plan.** Confirm with Shimaa the request/response shape for save and for the enrolled-students list. Why: your screen is a thin client over her API. Done when: the contract is written in your WORKLOG.
- [ ] **7. Write your Week 2 build plan.** In `WORKLOG.md`, sketch the screen (course picker + date picker + per-student status radios + save button). Done when: the sketch is written down.

## Week 2+ — Attendance Screen Build (T7 specific)

- [ ] **1. Build course + date selection.** Pickers load courses and default to today; changing either reloads the student list. Why: this is the entry to the primary user flow (PRD §7). Done when: selection always shows the correct enrolled students, and only them.
- [ ] **2. Build per-student status entry + save.** Radio options Present/Absent/Late per row plus one Save button calling `POST /attendance`. Why: core recording interaction (FR-04). Done when: valid records save and the API message is displayed.
- [ ] **3. Surface the Update message clearly.** When the API reports "already existed — updated", show it as an info message, not an error. Why: locked duplicate policy must be visible (TC-04). Done when: double-save shows the update message and no duplicate row appears.
- [ ] **4. Prove the flow with T6 + T8.** Only enrolled students appear; non-enrolled never render; TC-04 recorded passing. Done when: Shimaa and Sherina both confirm.

## Definition of Done
Correct student list appears per course/date, save/update works with clear messages, no non-enrolled student is ever shown.
