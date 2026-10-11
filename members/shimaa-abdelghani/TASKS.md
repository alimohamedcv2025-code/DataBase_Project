# Shimaa Abdelghani — T6 Attendance Business Logic (API)

- **Branch:** `feature/T6-attendance-logic`
- **Reviewer:** Salma Mohamed
- **Deliverables:** endpoints الحضور في `server/` + منطق التحقق.

## الأسبوع 1 (بناء المنطق)
- [ ] `POST /attendance`: حفظ حضور (طالب + كورس + تاريخ + Status).
- [ ] تنفيذ القرار المقفول: التكرار = **Update + رسالة** (مثال: "موجود مسبقاً — تم التحديث من Absent لـ Present").
- [ ] رفض تسجيل حضور لطالب غير مسجل في الكورس (TC-05).
- [ ] رفض `Status` خارج (Present/Absent/Late) + رفض الحقول الناقصة.

## الأسبوع 2 (اختبار + دعم)
- [ ] تجربة TC-04 + TC-05 وتسجيل النتائج مع Sherina.
- [ ] دعم Salma في ربط شاشة الحضور بالـ endpoints.
- [ ] مراجعة الأداء (الحفظ أقل من ثانيتين على بيانات التجربة).

## Definition of Done
مفيش سجل مكرر أو لطالب غير مسجل بيتحفظ، وكل رفض برسالة واضحة.
