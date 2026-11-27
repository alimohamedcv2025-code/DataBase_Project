# TASKS — Kerolos Eissa (T3 — Database SQL Server)

## Week X — Student Attendance (Database)

- [ ] **T3-ATT-1:** تصميم جدول `Attendance` (AttendanceID PK, StudentID FK, CourseID FK, SessionDate, Status [Present/Absent/Late], Notes)
- [ ] **T3-ATT-2:** إضافة الـ constraints: FKs + `UNIQUE (StudentID, CourseID, SessionDate)` + `CHECK` على الـ Status
- [ ] **T3-ATT-3:** كتابة script إنشاء الجدول `CreateAttendance.sql` جوه فولدر `/database`
- [ ] **T3-ATT-4:** عمل Stored Procedures: `sp_MarkAttendance`, `sp_GetAttendanceByStudent`, `sp_GetAttendanceByCourse`, `sp_GetAttendanceSummary`
- [ ] **T3-ATT-5:** عمل Seed data (بيانات تجريبية) وتجربة الـ queries
- [ ] **T3-ATT-6:** تسليم الـ scripts لـ Shimaa (T6 Attendance API) وSherina (T8 Reports)
- [ ] **T3-ATT-7:** رفع الشغل على branch `kerolos-feature/T3`  Request لـ Ali (Team Lead)
