# WORKLOG — Shahd Mourad

| التاريخ | عملت إيه | الدليل (commit / سكرينشوت) | معطل في إيه |
|---|---|---|---|
| 2026-10-20 | إعداد خطة بناء الأسبوع الثاني للتاسك T5 | WORKLOG.md | لا يوجد |

---

## Week 2 Build Plan — T5: Course & Enrollment Build

### 1. Screen UI Sketches
* **Course CRUD Screen:**
  * Fields: `CourseCode`, `CourseName`, `InstructorName`.
  * Validation: Display friendly error message when duplicate `CourseCode` is entered (FR-02).

* **Enrollment Screen:**
  * Components: Student Picker, Course Picker, Enroll/Remove buttons, Per-course student list.
  * Validation: Handle `UNIQUE(StudentID, CourseID)` constraint and show user-friendly message for duplicate enrollment (FR-03).

### 2. Required API Endpoints
* `GET /api/courses` — Fetch all available courses.
* `POST /api/courses` — Create a new course (with FR-02 uniqueness check).
* `GET /api/enrollments?courseId={id}` — Fetch enrolled students for a specific course.
* `POST /api/enrollments` — Enroll a student in a course (with FR-03 duplicate check).
* `DELETE /api/enrollments/{id}` — Remove a student enrollment.

### 3. Verification & Definition of Done
* Course CRUD and Enrollment flows work in UI without crashes.
* Duplicate errors (FR-02 & FR-03) show clear UI error messages instead of raw database errors.
* TC-03 passes via T8 integration test.
