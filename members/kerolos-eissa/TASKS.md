# Kerolos Eissa — T3 Database Development (SQL Server)

- **Branch:** `feature/T3-database`
- **Reviewer:** Kareem Wael + Ali Mohamed
- **Deliverables:** ملفات `database/01_schema.sql` + `02_seed_data.sql` + `03_queries.sql`.

## الأسبوع 1 (بناء القاعدة)
- [ ] `01_schema.sql`: داتابيز + جداول + PK/FK + `UNIQUE(StudentCode)` + `UNIQUE(CourseCode)` + `UNIQUE(StudentID,CourseID)` في Enrollments + `UNIQUE(StudentID,CourseID,AttendanceDate)` + `CHECK (Status IN ('Present','Absent','Late'))`.
- [ ] `02_seed_data.sql`: 50+ طالب + 5 كورسات + تسجيلات + 300-500 سجل حضور (SQL Server syntax).
- [ ] `03_queries.sql`: بحث بالاسم/الكود + سجل طالب + تقارير نسب.
- [ ] تجربة السكريبتات على instance فاضية من الصفر بدون تعديل يدوي.

## الأسبوع 2 (دعم + تثبيت)
- [ ] إصلاح أي constraint ناقص بعد تجربة T6.
- [ ] مساعدة Shimaa في ربط الـ API بالـ driver `mssql`.
- [ ] قياس زمن الاستعلامات الشائعة (المستهدف أقل من ثانيتين).

## Definition of Done
السكريبتات بتبني الداتابيز من الصفر، والـ seed كافي لديمو واقعي.
