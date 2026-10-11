# Technical Decisions (locked)

Date: 2026-10-11

## 1. Database: SQL Server
- Engine: SQL Server (local instance).
- Driver for backend: `mssql` (Node.js).
- Scripts live in `database/`:
  - `01_schema.sql` — tables, PKs, UNIQUE, CHECK on `Status`.
  - `02_seed_data.sql` — 50+ students, 5 courses, enrollments, 300-500 attendance rows.
  - `03_queries.sql` — search, history, reports.

## 2. Architecture: React + Express + SQL Server
- `client/` — React (Vite), runs locally (e.g. `npm run dev`).
- `server/` — Node.js + Express REST API, runs locally (e.g. `node server.js`).
- React never talks to SQL Server directly; all DB access goes through the API.
- Local-only demo, no internet required.

## 3. Duplicate attendance: Update + message
- Context: TC-04 in PRD was ambiguous (prevent vs update).
- Decision: on duplicate (same `StudentID` + `CourseID` + `AttendanceDate`),
  **UPDATE** the existing `Status` and return a clear message
  (e.g. "Attendance already existed — updated from Absent to Present").
- Enforced in two layers:
  1. DB: `UNIQUE(StudentID, CourseID, AttendanceDate)`.
  2. API: upsert logic with friendly message.

## 4. Delete policy: RESTRICT + message
- Cannot delete a student/course with related enrollments/attendance.
- API returns clear message (e.g. "Cannot delete: student has attendance records").

## 5. What changed vs PRD v1.0
- PRD said "Desktop App" — now **local Web App (React)**.
- PRD said "SQL Server or MySQL" — now **SQL Server**.
- PRD TC-04 ambiguity — now **Update + message**.
