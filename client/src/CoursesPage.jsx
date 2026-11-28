import { useState } from 'react';
import { requestApi } from './api';
import { Feedback, ListStatus } from './Feedback';
import { useApiList } from './useApiList';

const URL = '/api/courses';
const EMPTY_FORM = { courseCode: '', courseName: '', instructorName: '' };

export default function CoursesPage() {
  const courses = useApiList(URL);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null);

  function changeField(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  function reset() {
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  function edit(course) {
    setMessage(null);
    setEditingId(course.id);
    setForm({
      courseCode: course.courseCode,
      courseName: course.courseName,
      instructorName: course.instructorName ?? '',
    });
  }

  async function save(event) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setMessage(null);
    try {
      const adding = editingId === null;
      await requestApi(adding ? URL : URL + '/' + editingId, {
        method: adding ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      reset();
      courses.refresh();
      setMessage({ text: adding ? 'تمت إضافة المادة.' : 'تم حفظ تعديلات المادة.' });
    } catch (error) {
      setMessage({ error: true, text: error.message });
    } finally {
      setBusy(false);
    }
  }

  async function remove(course) {
    if (busy || !window.confirm('حذف مادة ' + course.courseName + '؟')) return;
    setBusy(true);
    setMessage(null);
    try {
      await requestApi(URL + '/' + course.id, { method: 'DELETE' });
      if (editingId === course.id) reset();
      courses.refresh();
      setMessage({ text: 'تم حذف المادة.' });
    } catch (error) {
      setMessage({ error: true, text: error.message });
    } finally {
      setBusy(false);
    }
  }

  const ready = !courses.loading && !courses.error;
  return (
    <div>
      <header className="topbar">
        <div>
          <h1>إدارة المواد</h1>
          {ready && <p className="subtitle">إجمالي المواد: {courses.rows.length}</p>}
        </div>
      </header>
      <Feedback message={message} />
      <main className="workspace-grid">
        <section className="card">
          <h2>{editingId === null ? 'إضافة مادة' : 'تعديل المادة'}</h2>
          <form className="student-form" onSubmit={save}>
            <fieldset disabled={!ready || busy}>
              <label>
                كود المادة
                <input name="courseCode" value={form.courseCode} onChange={changeField} maxLength={20} required dir="ltr" />
              </label>
              <label>
                اسم المادة
                <input name="courseName" value={form.courseName} onChange={changeField} maxLength={120} required dir="auto" />
              </label>
              <label>
                اسم المدرّس
                <input name="instructorName" value={form.instructorName} onChange={changeField} maxLength={120} dir="auto" />
              </label>
              <div className="form-actions">
                <button type="submit" className="btn-primary">{editingId === null ? 'إضافة المادة' : 'حفظ التعديلات'}</button>
                {editingId !== null && <button type="button" className="btn-secondary" onClick={reset}>إلغاء</button>}
              </div>
            </fieldset>
          </form>
        </section>

        <section className="card" aria-label="قائمة المواد">
          <ListStatus list={courses} />
          {ready && courses.rows.length === 0 && <p className="empty-state">مفيش مواد مضافة.</p>}
          {ready && courses.rows.length > 0 && (
            <div className="table-wrap">
              <table>
                <thead><tr><th>الكود</th><th>المادة</th><th>المدرّس</th><th>إجراءات</th></tr></thead>
                <tbody>
                  {courses.rows.map((course) => (
                    <tr key={course.id}>
                      <td className="mono"><bdi>{course.courseCode}</bdi></td>
                      <td dir="auto">{course.courseName}</td>
                      <td dir="auto">{course.instructorName || '—'}</td>
                      <td>
                        <div className="actions-cell">
                          <button type="button" className="btn-edit" onClick={() => edit(course)} disabled={busy}>تعديل</button>
                          <button type="button" className="btn-delete" onClick={() => remove(course)} disabled={busy}>حذف</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
