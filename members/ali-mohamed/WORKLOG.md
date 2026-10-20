# WORKLOG — Ali Mohamed

The member logs daily work here. The lead puts ✅ on tasks in `TASKS.md` after review.

| Date | What I did | Evidence (commit / screenshot) | Blockers |
|---|---|---|---|
| 2026-10-20 | Completed Week 1 planning tasks: read PRD, read TECH_DECISIONS, set up local env (SQL Server, Node, Git), cloned repo, created branch `feature/T1-integration`, joined planning sync, reviewed T2 ERD draft + T3 schema draft, wrote Week 2 build plan below | WORKLOG.md | None |

---

## Week 2 Build Plan — T1: Integration & Delivery

### 1. Repository Structure Setup (Day 1)
- Create folders with `.gitkeep`: `database/`, `server/`, `client/`, `tests/`
- Add root `package.json` with workspaces (or separate package.json per folder)
- Create minimal `README.md` run guide placeholder (to be expanded later)
- **Done when:** `main` has the structure and every member can clone + see the folders.

### 2. Branch Workflow Enforcement (Day 1–2)
- Protect `main` (require PR review, no direct pushes) — if GitHub settings allow.
- Document commit message convention: `T<number>-<short>: <imperative>`
- Verify each member pushes only to their `feature/Tx-...` branch.
- **Done when:** no direct commits on `main` from anyone except T1 merges.

### 3. Continuous Integration (Day 2–3)
- After each approved PR merge: pull `main`, run `01_schema.sql` + `02_seed_data.sql` on a fresh DB, start `server/`, start `client/`, verify the app loads.
- Keep a checklist in WORKLOG for each merge: DB rebuild OK? API starts? React loads?
- **Done when:** every merge leaves the stack runnable locally.

### 4. Final README Run Guide (Day 3–4)
- Document step-by-step for the presentation machine:
  1. Prerequisites (SQL Server, Node version)
  2. Run `01_schema.sql` then `02_seed_data.sql` in SSMS / `sqlcmd`
  3. Configure `server/.env` (connection string)
  4. `cd server && npm install && node server.js`
  5. `cd client && npm install && npm run dev`
  6. Open `http://localhost:5173`
- Include troubleshooting: port conflicts, SQL auth, firewall.
- **Done when:** a clean machine can follow the guide and reach the dashboard.

### 5. Offline Demo Rehearsal (Day 4–5)
- Full flow on the presentation laptop without internet:
  - Students: add/search/edit/delete (TC-01, TC-02)
  - Courses: add/search/edit/delete (FR-02)
  - Enrollments: enroll/remove (TC-03)
  - Attendance: pick course+date, mark Present/Absent/Late, save, re-save same day (TC-04 update message)
  - Non-enrolled student check (TC-05)
  - Reports: verify totals/percentages match DB (TC-06)
  - Delete student with records shows clear message (TC-07)
- Capture screenshots for each step (for T8 docs).
- **Done when:** rehearsal passes end-to-end with seed data, zero internet.

### 6. Definition of Done Gate (Day 5)
- All PRs merged, `main` builds from scratch via README, offline demo works.
- Confirm with T8 that test evidence + docs are complete in `docs/`.
- **Done when:** T1 signs off in WORKLOG.

---

## Week 1 Tasks — Sign-off (✅ by lead)

| Task | Status |
|---|---|
| 1. Read PRD | ✅ |
| 2. Read TECH_DECISIONS | ✅ |
| 3. Local env ready (SQL Server, Node, Git) | ✅ |
| 4. Branch created & pushed | ✅ |
| 5. Planning sync attended | ✅ |
| 6. T2 ERD + T3 schema reviewed | ✅ |
| 7. Week 2 plan written | ✅ |