import { useState } from 'react';
import { requestApi } from './api';
import { attendanceStatuses } from './attendanceStatus';
import { Feedback, ListStatus } from './Feedback';
import { useApiList } from './useApiList';

function today() {
  const date = new Date();
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
}

function AttendanceSheet({ courseId, date }) {
  const path = '/api/attendance/' + courseId + '/' + date;
  const roster = useApiList(path);
  const [draft, setDraft] = useState({});
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null);
  const ready = !roster.loading && !roster.error;

  function changeStatus(student, status) {
    setDraft((previous) => {
      const next = { ...previous };
      if (status === (student.status ?? '')) delete next[student.studentId];
      else next[student.studentId] = status;
      return next;
    });
    setMessage(null);
  }

  const marks = roster.rows
    .filter((student) => draft[student.studentId])
    .map((student) => ({ studentId: student.studentId, status: draft[student.studentId] }));

  async function save(event) {
    event.preventDefault();
    if (!ready || busy || !marks.length) return;
    setBusy(true);
    setMessage(null);
    try {
      const result = await requestApi(path, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ marks }),
      });
      setDraft({});
      roster.refresh();
      setMessage({ text: 'تم الحفظ. سجلات جديدة: ' + result.inserted + '، محدّثة: ' + result.updated + '، بدون تغيير: ' + result.unchanged + '.' });
    } catch (error) {
      setMessage({ error: true, text: error.message });
      roster.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Feedback message={message} />
      <section className="card">
        <h2>كشف الحضور{ready ? ' (' + roster.rows.length + ')' : ''}</h2>
        <ListStatus list={roster} />
        {ready && roster.rows.length === 0 && <p className="empty-state">مفيش طلبة مسجّلين في المادة دي.</p>}
        {ready && roster.rows.length > 0 && (
          <form onSubmit={save}>
            <div className="table-wrap">
              <table>
                <thead><tr><th>الكود</th><th>الطالب</th><th>الحالة</th></tr></thead>
                <tbody>
                  {roster.rows.map((student) => (
                    <tr key={student.studentId}>
                      <td className="mono"><bdi>{student.studentCode}</bdi></td>
                      <td className="student-name" dir="auto">{student.fullName}</td>
                      <td>
                        <select
                          className="status-select"
                          aria-label={'حالة حضور ' + student.studentCode}
                          value={draft[student.studentId] ?? student.status ?? ''}
                          disabled={busy}
                          onChange={(event) => changeStatus(student, event.target.value)}
                        >
                          {student.status == null && <option value="">غير مسجّل</option>}
                          {Object.entries(attendanceStatuses).map(([status, label]) => <option value={status} key={status}>{label}</option>)}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="record-actions">
              <button type="submit" className="btn-primary" disabled={busy || !marks.length}>
                {busy ? 'جاري الحفظ…' : 'حفظ الحضور'}
              </button>
              {marks.length > 0 && <span>{marks.length} حالة بانتظار الحفظ</span>}
            </div>
          </form>
        )}
      </section>
    </>
  );
}

export default function AttendancePage() {
  const courses = useApiList('/api/courses');
  const [selection, setSelection] = useState({ courseId: '', date: today() });
  const [sheet, setSheet] = useState(null);

  function changeField(event) {
    const { name, value } = event.target;
    setSelection((previous) => ({ ...previous, [name]: value }));
  }

  function showSheet(event) {
    event.preventDefault();
    setSheet((previous) => ({ ...selection, version: (previous?.version ?? 0) + 1 }));
  }

  return (
    <div>
      <header className="topbar"><h1>تسجيل الحضور</h1></header>
      <section className="card filters-card">
        <ListStatus list={courses} />
        <form onSubmit={showSheet} className="filter-fields">
          <label>
            المادة
            <select name="courseId" required value={selection.courseId} onChange={changeField} disabled={courses.loading || Boolean(courses.error)}>
              <option value="">اختار مادة</option>
              {courses.rows.map((course) => (
                <option key={course.id} value={course.id}>{course.courseName} ({course.courseCode})</option>
              ))}
            </select>
          </label>
          <label>
            تاريخ الحضور
            <input type="date" name="date" required value={selection.date} onChange={changeField} />
          </label>
          <button type="submit" className="btn-primary" disabled={!selection.courseId || !selection.date || courses.loading || Boolean(courses.error)}>
            عرض الكشف
          </button>
        </form>
      </section>
      {sheet && (
        <>
          <p className="sheet-selection" dir="auto">{courses.rows.find(({ id }) => String(id) === sheet.courseId)?.courseName} · {sheet.date}</p>
          <AttendanceSheet key={sheet.version} courseId={sheet.courseId} date={sheet.date} />
        </>
      )}
    </div>
  );
}
