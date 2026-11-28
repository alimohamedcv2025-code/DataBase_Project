import { useState } from 'react';
import { requestApi } from './api';
import { Feedback, ListStatus } from './Feedback';
import { useApiList } from './useApiList';

function CourseRoster({ courseId, students }) {
  const path = '/api/courses/' + courseId + '/enrollments';
  const roster = useApiList(path);
  const [studentId, setStudentId] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null);

  const enrolled = new Set(roster.rows.map((student) => student.id));
  const available = students.rows.filter((student) => !enrolled.has(student.id));
  const ready = !roster.loading && !roster.error;
  const selectedStudentId = available.some((student) => String(student.id) === studentId) ? studentId : '';

  async function enroll(event) {
    event.preventDefault();
    if (!selectedStudentId || busy) return;
    setBusy(true);
    setMessage(null);
    try {
      const result = await requestApi(path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: Number(selectedStudentId) }),
      });
      setStudentId('');
      roster.refresh();
      setMessage({ text: result.outcome === 'reactivated' ? 'تم تفعيل التسجيل من جديد.' : 'تم تسجيل الطالب في المادة.' });
    } catch (error) {
      roster.refresh();
      setMessage({ error: true, text: error.message });
    } finally {
      setBusy(false);
    }
  }

  async function withdraw(student) {
    if (busy || !window.confirm('إلغاء تسجيل ' + student.fullName + ' في المادة؟')) return;
    setBusy(true);
    setMessage(null);
    try {
      await requestApi(path + '/' + student.id, { method: 'DELETE' });
      roster.refresh();
      setMessage({ text: 'تم إلغاء التسجيل. سجل الحضور محفوظ.' });
    } catch (error) {
      roster.refresh();
      setMessage({ error: true, text: error.message });
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Feedback message={message} />
      <main className="workspace-grid">
        <section className="card">
          <h2>تسجيل طالب</h2>
          <ListStatus list={students} />
          <form className="student-form" onSubmit={enroll}>
            <fieldset disabled={!ready || students.loading || Boolean(students.error) || busy}>
              <label>
                الطالب
                <select value={selectedStudentId} onChange={(event) => setStudentId(event.target.value)} required>
                  <option value="">اختار طالب</option>
                  {available.map((student) => (
                    <option key={student.id} value={student.id}>{student.fullName} ({student.studentCode})</option>
                  ))}
                </select>
              </label>
              <div className="form-actions">
                <button type="submit" className="btn-primary" disabled={!selectedStudentId}>تسجيل الطالب</button>
              </div>
            </fieldset>
          </form>
        </section>

        <section className="card" aria-label="كشف المادة">
          <h2>كشف المادة{ready ? ' (' + roster.rows.length + ')' : ''}</h2>
          <ListStatus list={roster} />
          {ready && roster.rows.length === 0 && <p className="empty-state">مفيش طلبة مسجّلين في المادة دي.</p>}
          {ready && roster.rows.length > 0 && (
            <div className="table-wrap">
              <table>
                <thead><tr><th>الكود</th><th>الطالب</th><th>القسم</th><th>إجراءات</th></tr></thead>
                <tbody>
                  {roster.rows.map((student) => (
                    <tr key={student.id}>
                      <td className="mono"><bdi>{student.studentCode}</bdi></td>
                      <td className="student-name" dir="auto">{student.fullName}</td>
                      <td dir="auto">{student.department || '—'}</td>
                      <td>
                        <button className="btn-delete" type="button" onClick={() => withdraw(student)} disabled={busy}>إلغاء التسجيل</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </>
  );
}

export default function EnrollmentsPage() {
  const courses = useApiList('/api/courses');
  const students = useApiList('/api/students');
  const [courseId, setCourseId] = useState('');

  return (
    <div>
      <header className="topbar"><h1>التسجيل في المواد</h1></header>
      <section className="card course-picker">
        <ListStatus list={courses} />
        <div className="student-form">
          <label>
            المادة
            <select value={courseId} onChange={(event) => setCourseId(event.target.value)} disabled={courses.loading || Boolean(courses.error)}>
              <option value="">{!courses.loading && !courses.error && !courses.rows.length ? 'مفيش مواد مضافة' : 'اختار مادة'}</option>
              {courses.rows.map((course) => (
                <option key={course.id} value={course.id}>{course.courseName} ({course.courseCode})</option>
              ))}
            </select>
          </label>
        </div>
      </section>
      {courseId && <CourseRoster key={courseId} courseId={courseId} students={students} />}
    </div>
  );
}
