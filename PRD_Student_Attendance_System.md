# Product Requirements Document
## Student Attendance Management System

| Property | Value |
|---|---|
| Version | 1.0 |
| Project Type | Database Course Project |
| Team Size | 8 members |
| Status | Ready for team execution |

## 1. Purpose

This document defines the requirements, scope, data model, implementation responsibilities, and acceptance criteria for the Student Attendance Management System. It is the shared project reference for all team members.

## 2. Product Overview

The Student Attendance Management System is a simple desktop application backed by a relational SQL database. It allows users to manage students, courses, enrollments, and daily attendance records. The GUI is used to enter and retrieve data; the database is the core project deliverable.

## 3. Problem Statement

Manual attendance records are difficult to maintain, search, and summarize accurately. This system centralizes attendance data, prevents duplicate records, and produces reliable attendance summaries.

## 4. Goals

- Design a normalized relational database for student attendance.
- Manage students, courses, and course enrollments.
- Record `Present`, `Absent`, and `Late` attendance statuses.
- Prevent invalid and duplicate records.
- Provide a simple GUI and clear reports.

## 5. Scope

### In Scope

- Student management
- Course management
- Enrollment management
- Daily attendance recording
- Attendance history and basic reports
- SQL schema, seed data, queries, GUI, testing, and documentation

### Out of Scope

- Biometric attendance, QR codes, RFID, mobile applications, notifications, cloud deployment, and external university integrations.

## 6. User Roles

| Role | Responsibilities |
|---|---|
| Administrator | Manages students, courses, and enrollments; views reports. |
| Instructor | Records attendance for students in a selected course. |
| Administrative User | Searches attendance history and views reports. |

> Authentication is optional for Version 1. If implemented, it may use the roles above.

## 7. Primary User Flow

1. The instructor opens the Attendance screen.
2. The instructor selects a course and date.
3. The system displays students enrolled in that course.
4. The instructor selects `Present`, `Absent`, or `Late` for each student.
5. The instructor saves the records.
6. The system validates the input and prevents duplicate attendance for the same student, course, and date.
7. An administrator can later view history and reports.

## 8. Functional Requirements

| ID | Requirement | Description | Acceptance Criteria |
|---|---|---|---|
| FR-01 | Student Management | Create, view, update, delete, and search student records. | Search works by name or student code; data refreshes after each action. |
| FR-02 | Course Management | Create, view, update, and delete course records. | Duplicate course codes are rejected. |
| FR-03 | Enrollment Management | Enroll a student in a course and remove an enrollment. | Duplicate enrollments are prevented. |
| FR-04 | Attendance Recording | Record a status for each enrolled student by course and date. | Valid attendance records are saved correctly. |
| FR-05 | Duplicate Prevention | Prevent repeated attendance records. | Only one record exists per student, course, and date. |
| FR-06 | Attendance History | Display student history with course and date filters. | Filtered results are accurate. |
| FR-07 | Reports | Produce attendance, absence, and lateness summaries. | Totals and percentages match the database data. |
| FR-08 | Input Validation | Validate required fields and invalid input. | Invalid data is not saved; the user sees a clear message. |

## 9. Non-Functional Requirements

- The GUI must be simple and readable for a classroom demonstration.
- The application must run locally without internet access.
- Common actions should finish in less than two seconds using seed data.
- Every create, update, delete, and save operation must return a clear message.
- Source code, SQL scripts, and documentation must be stored in one Git repository.
- The selected database engine must be SQL Server or MySQL, as agreed by the team.

## 10. Data Model

### 10.1 Tables

| Table | Purpose | Key Fields |
|---|---|---|
| `Students` | Student information. | `StudentID (PK)`, `StudentCode (UNIQUE)`, `FullName`, `Email`, `Department`, `Level` |
| `Courses` | Course information. | `CourseID (PK)`, `CourseCode (UNIQUE)`, `CourseName`, `InstructorName` |
| `Enrollments` | Student-to-course relationship. | `EnrollmentID (PK)`, `StudentID (FK)`, `CourseID (FK)` |
| `Attendance` | Daily attendance records. | `AttendanceID (PK)`, `StudentID (FK)`, `CourseID (FK)`, `AttendanceDate`, `Status` |
| `Users` (optional) | Application login users. | `UserID (PK)`, `Username (UNIQUE)`, `Password`, `Role` |

### 10.2 Relationships

```text
Students 1 --- * Enrollments * --- 1 Courses
Students 1 --- * Attendance  * --- 1 Courses
```

- A student can enroll in many courses.
- A course can have many enrolled students.
- Each attendance record belongs to one student, one course, and one date.

### 10.3 Business Rules

- `StudentCode` and `CourseCode` must be unique.
- `Enrollments` must enforce `UNIQUE(StudentID, CourseID)`.
- `Attendance` must enforce `UNIQUE(StudentID, CourseID, AttendanceDate)`.
- `Status` accepts only `Present`, `Absent`, or `Late`.
- Attendance cannot be recorded for a student who is not enrolled in the selected course.
- A student or course with related records cannot be deleted unless a safe deletion policy is implemented.

## 11. Required GUI Screens

| Screen | Required Features | Acceptance Criteria |
|---|---|---|
| Dashboard | Navigation to all functions. | Each button opens the correct screen. |
| Student Management | Form, list, search, create, update, and delete. | All CRUD actions work with validation. |
| Course Management | Form, list, create, update, and delete. | Duplicate course codes are rejected. |
| Enrollment Management | Student/course selection and enrollment actions. | Duplicate relationships are prevented. |
| Attendance Recording | Course/date selection, status selection, and save action. | Only enrolled students appear; valid records save. |
| History and Reports | Filters and tabular reports. | Calculations and results are correct. |

## 12. SQL Deliverables

```text
database/
├── 01_schema.sql
├── 02_seed_data.sql
├── 03_queries.sql
└── 04_procedures_optional.sql
```

| File | Required Content |
|---|---|
| `01_schema.sql` | Database, tables, keys, constraints, and validation rules. |
| `02_seed_data.sql` | At least 50 students, 5 courses, enrollments, and 100 attendance records. |
| `03_queries.sql` | Search, attendance history, and report queries. |
| `04_procedures_optional.sql` | Stored procedures, if the team chooses to use them. |

## 13. Repository Structure

```text
student-attendance-system/
├── database/
├── src/
├── docs/
│   ├── PRD_Student_Attendance_System.md
│   └── ERD.png
├── tests/
└── README.md
```

## 14. Team Work Packages

Each task has one owner and one reviewer. The owner implements the task; the reviewer verifies the acceptance criteria before merging it.

| Task | Owner | Scope | Deliverable | Acceptance Criteria |
|---|---|---|---|---|
| T1 | Member 1: Team Lead and Integration | Repository, task board, project structure, and integration. | Organized repository and `README.md`. | The project can be set up using the README. |
| T2 | Member 2: Analysis and ERD | Entities, attributes, keys, relationships, and rules. | `ERD.png` or `ERD.pdf`. | ERD matches this PRD and the SQL schema. |
| T3 | Member 3: Database Development | Schema, constraints, seed data, and baseline queries. | SQL files in `database/`. | Scripts work on a new database instance. |
| T4 | Member 4: Student Management UI | Student CRUD screen and database connection. | Student Management screen. | Create, update, delete, and search all work. |
| T5 | Member 5: Course and Enrollment UI | Course CRUD and student-course enrollment. | Course and Enrollment screens. | Duplicate courses and enrollments are prevented. |
| T6 | Member 6: Attendance Business Logic | Validation, persistence, and duplicate prevention. | Attendance logic and SQL queries/procedures. | No duplicate or invalid enrollment attendance is saved. |
| T7 | Member 7: Attendance UI | Course/date selection, status entry, and save screen. | Attendance Recording screen. | Correct student list appears and saves successfully. |
| T8 | Member 8: Reports, Testing, and Documentation | Reports, test evidence, screenshots, and documentation. | Reports, test results, and documentation. | Reports are accurate and documentation is complete. |

## 15. Collaboration Rules

1. Each member works in a task-specific branch, for example `feature/T4-student-management`.
2. Every completed task must be reviewed before it is merged.
3. The reviewer tests the acceptance criteria listed for the task.
4. Changes to tables or relationships require approval from the owners of T2 and T3.
5. Hold a short daily meeting: completed work, next work, and blockers.
6. Each member explains their completed work to the team.
7. During final testing, every member runs the application and reports any issue found.

## 16. Proposed Timeline

| Phase | Duration | Outcome |
|---|---:|---|
| Planning | 2 days | Approved PRD, ERD, tools, and assignments. |
| Database Development | 3 days | Schema, seed data, and baseline queries. |
| GUI and Business Logic | 4-5 days | Completed screens and database integration. |
| Reporting and Testing | 2 days | Reports, test evidence, and bug fixes. |
| Final Delivery | 1-2 days | README, screenshots, and presentation preparation. |

## 17. Required Test Cases

| ID | Test Case | Expected Result |
|---|---|---|
| TC-01 | Add a student with a new student code. | The student is created and appears in the list. |
| TC-02 | Add a student with an existing student code. | The operation is rejected with a clear message. |
| TC-03 | Enroll a student in a course. | The student appears in that course's attendance list. |
| TC-04 | Save attendance twice for the same student, course, and date. | The system prevents a duplicate record or updates the existing one according to the agreed design. |
| TC-05 | Record attendance for a student not enrolled in the selected course. | The system rejects the action. |
| TC-06 | Run a student attendance report. | Totals and percentages match the database data. |
| TC-07 | Delete a student with attendance records. | The system protects referential integrity and shows a clear message. |

## 18. Definition of Done

The project is ready for submission when:

- Requirements `FR-01` through `FR-08` are implemented and demonstrated.
- SQL scripts create the database from scratch without manual changes.
- Seed data is sufficient for a realistic demonstration.
- Required test cases have been executed and recorded.
- The application runs locally on the presentation device.
- The repository contains the README, ERD, SQL scripts, source code, and tests.
- Every member can explain their component and its integration with the system.
