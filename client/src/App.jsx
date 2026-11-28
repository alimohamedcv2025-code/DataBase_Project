import { useEffect, useState } from 'react';
import './App.css';

const EMPTY_FORM = { studentCode: '', fullName: '', email: '', department: '', level: '' };
const API_URL = '/api/students';

async function requestStudents(path = '', options) {
  let response;
  try {
    response = await fetch(API_URL + path, options);
  } catch {
    throw new Error('تعذّر الاتصال بالسيرفر. تأكد إن الـBackend شغّال.');
  }

  if (response.status === 204) return;
  const data = await response.json().catch(() => null);
  if (!response.ok || data === null) {
    throw new Error(data?.error || 'تعذّر إكمال الطلب. تأكد إن الـBackend شغّال ومتصل بقاعدة البيانات.');
  }
  return data;
}

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [reload, setReload] = useState(0);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    requestStudents('', { signal: controller.signal })
      .then((rows) => {
        if (!controller.signal.aborted) setStudents(rows);
      })
      .catch((error) => {
        if (!controller.signal.aborted) setLoadError(error.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [reload]);

  const departments = [...new Set(students.map((student) => student.department).filter(Boolean))].sort();
  const selectedDepartment = departments.includes(department) ? department : '';
  const query = search.trim().toLowerCase();
  const results = students.filter((student) =>
    (!selectedDepartment || student.department === selectedDepartment) &&
    [student.studentCode, student.fullName, student.email].some((value) =>
      (value ?? '').toLowerCase().includes(query))
  ).sort((a, b) => a.fullName.localeCompare(b.fullName) || a.id - b.id);

  function changeField(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  function resetForm() {
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  function editStudent(student) {
    setMessage(null);
    setEditingId(student.id);
    setForm({
      studentCode: student.studentCode,
      fullName: student.fullName,
      email: student.email ?? '',
      department: student.department ?? '',
      level: student.level == null ? '' : String(student.level),
    });
  }

  async function saveStudent(event) {
    event.preventDefault();
    if (saving) return;
    setSaving(true);
    setMessage(null);

    try {
      const student = await requestStudents(editingId === null ? '' : '/' + editingId, {
        method: editingId === null ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, level: form.level === '' ? null : Number(form.level) }),
      });
      setStudents((previous) => editingId === null
        ? [...previous, student]
        : previous.map((item) => item.id === student.id ? student : item));
      setDepartment('');
      setSearch('');
      setMessage({ text: editingId === null ? 'تمت إضافة الطالب.' : 'تم حفظ التعديلات.' });
      resetForm();
    } catch (error) {
      setMessage({ error: true, text: error.message });
    } finally {
      setSaving(false);
    }
  }

  async function deleteStudent(student) {
    if (saving || !window.confirm('حذف الطالب ' + student.fullName + '؟')) return;
    setSaving(true);
    setMessage(null);

    try {
      await requestStudents('/' + student.id, { method: 'DELETE' });
      setStudents((previous) => previous.filter((item) => item.id !== student.id));
      if (editingId === student.id) resetForm();
      setMessage({ text: 'تم حذف الطالب.' });
    } catch (error) {
      setMessage({ error: true, text: error.message });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="app-shell" dir="rtl">
      <header className="topbar">
        <div>
          <h1>إدارة الطلبة</h1>
          {!loading && !loadError && <p className="subtitle">إجمالي الطلبة: {students.length}</p>}
        </div>
      </header>

      {message && (
        <p className={message.error ? 'alert-error' : 'toast'} role={message.error ? 'alert' : 'status'} dir="auto">
          {message.text}
        </p>
      )}

      <main className="workspace-grid">
        <section className="card">
          <h2>{editingId === null ? 'إضافة طالب' : 'تعديل بيانات الطالب'}</h2>
          <form className="student-form" onSubmit={saveStudent}>
            <fieldset disabled={loading || Boolean(loadError) || saving}>
              <label>
                كود الطالب
                <input name="studentCode" value={form.studentCode} onChange={changeField} maxLength={20} required dir="ltr" />
              </label>
              <label>
                الاسم الكامل
                <input name="fullName" value={form.fullName} onChange={changeField} maxLength={120} required dir="auto" />
              </label>
              <label>
                البريد الإلكتروني
                <input type="email" name="email" value={form.email} onChange={changeField} maxLength={254} dir="ltr" />
              </label>
              <div className="two-cols">
                <label>
                  القسم
                  <input name="department" value={form.department} onChange={changeField} maxLength={100} dir="auto" />
                </label>
                <label>
                  المستوى
                  <input type="number" name="level" value={form.level} onChange={changeField} min={1} max={255} step={1} />
                </label>
              </div>
              <div className="form-actions">
                <button className="btn-primary" type="submit">
                  {editingId === null ? 'إضافة الطالب' : 'حفظ التعديلات'}
                </button>
                {editingId !== null && (
                  <button className="btn-secondary" type="button" onClick={() => { resetForm(); setMessage(null); }}>
                    إلغاء
                  </button>
                )}
              </div>
            </fieldset>
          </form>
        </section>

        <section className="card table-card" aria-label="قائمة الطلبة">
          <div className="toolbar">
            <input
              type="search"
              aria-label="ابحث عن طالب"
              placeholder="ابحث بالاسم أو الكود أو الإيميل"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              disabled={loading || Boolean(loadError)}
            />
            <select
              aria-label="فلترة حسب القسم"
              value={selectedDepartment}
              onChange={(event) => setDepartment(event.target.value)}
              disabled={loading || Boolean(loadError)}
            >
              <option value="">كل الأقسام</option>
              {departments.map((name) => <option key={name}>{name}</option>)}
            </select>
          </div>

          {loading && <p role="status" className="empty-state">جاري تحميل الطلبة…</p>}
          {!loading && loadError && (
            <div role="alert" className="alert-error">
              <p>{loadError}</p>
              <button className="btn-secondary" type="button" onClick={() => {
                setLoadError('');
                setLoading(true);
                setReload((previous) => previous + 1);
              }}>إعادة المحاولة</button>
            </div>
          )}
          {!loading && !loadError && results.length === 0 && (
            <p className="empty-state">{students.length ? 'مفيش طلبة مطابقين للبحث.' : 'مفيش طلبة مسجّلين.'}</p>
          )}
          {!loading && !loadError && results.length > 0 && (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>الكود</th><th>الطالب</th><th>القسم</th><th>المستوى</th><th>إجراءات</th></tr>
                </thead>
                <tbody>
                  {results.map((student) => (
                    <tr key={student.id}>
                      <td className="mono"><bdi>{student.studentCode}</bdi></td>
                      <td>
                        <div className="student-name" dir="auto">{student.fullName}</div>
                        {student.email && <div className="student-email" dir="ltr">{student.email}</div>}
                      </td>
                      <td dir="auto">{student.department || '—'}</td>
                      <td>{student.level ?? '—'}</td>
                      <td>
                        <div className="actions-cell">
                          <button type="button" className="btn-edit" onClick={() => editStudent(student)} disabled={saving}>تعديل</button>
                          <button type="button" className="btn-delete" onClick={() => deleteStudent(student)} disabled={saving}>حذف</button>
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

export default App;
