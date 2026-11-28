import { useState } from 'react';
import { attendanceStatuses } from './attendanceStatus';
import { ListStatus } from './Feedback';
import { useApiList } from './useApiList';

const EMPTY_FILTER = { courseId: '', studentId: '', from: '', to: '' };
const metrics = [
  { key: 'present', label: attendanceStatuses.Present },
  { key: 'absent', label: attendanceStatuses.Absent },
  { key: 'late', label: attendanceStatuses.Late },
];

function ReportResult({ params, page, goTo }) {
  const list = useApiList('/api/attendance?' + new URLSearchParams({ ...params, page }));
  const result = list.rows;
  if (list.loading || list.error) {
    return <section className="card"><ListStatus list={list} /></section>;
  }

  const { summary, rows, pageSize } = result;
  const pages = Math.max(1, Math.ceil(summary.total / pageSize));
  return (
    <>
      <section className="report-summary" aria-label="ملخص الحضور">
        <div className="card"><span>إجمالي السجلات</span><strong dir="ltr">{summary.total}</strong></div>
        {metrics.map(({ key, label }) => (
          <div className="card" key={key}>
            <span>{label}</span>
            <strong dir="ltr">{summary[key]}</strong>
            <span dir="ltr">{summary[key + 'Percent']}%</span>
          </div>
        ))}
      </section>
      <section className="card" aria-label="سجل الحضور">
        <h2>سجل الحضور</h2>
        {rows.length === 0 && <p className="empty-state">مفيش سجلات حضور في النتائج دي.</p>}
        {rows.length > 0 && (
          <div className="table-wrap">
            <table>
              <thead><tr><th>التاريخ</th><th>كود الطالب</th><th>الطالب</th><th>المادة</th><th>الحالة</th></tr></thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id}>
                    <td className="mono"><bdi>{row.date}</bdi></td>
                    <td className="mono"><bdi>{row.studentCode}</bdi></td>
                    <td dir="auto">{row.fullName}</td>
                    <td dir="auto">{row.courseName} ({row.courseCode})</td>
                    <td>{attendanceStatuses[row.status]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {(pages > 1 || page > 1) && (
          <div className="record-actions">
            <button className="btn-secondary" disabled={page <= 1} onClick={() => goTo(Math.min(pages, page - 1))}>السابق</button>
            <span>صفحة {page} من {pages}</span>
            <button className="btn-secondary" disabled={page >= pages} onClick={() => goTo(page + 1)}>التالي</button>
          </div>
        )}
      </section>
    </>
  );
}

export default function ReportsPage() {
  const courses = useApiList('/api/courses');
  const students = useApiList('/api/students');
  const [filter, setFilter] = useState(EMPTY_FILTER);
  const [applied, setApplied] = useState({ params: {}, version: 0 });
  const [page, setPage] = useState(1);

  function changeField(event) {
    const { name, value } = event.target;
    setFilter((previous) => ({ ...previous, [name]: value }));
  }

  function apply(event) {
    event.preventDefault();
    const params = Object.fromEntries(Object.entries(filter).filter(([, value]) => value));
    setPage(1);
    setApplied((previous) => ({ params, version: previous.version + 1 }));
  }

  return (
    <div>
      <header className="topbar"><h1>السجل والتقارير</h1></header>
      <section className="card filters-card">
        <ListStatus list={courses} />
        <ListStatus list={students} />
        <form className="filter-fields" onSubmit={apply}>
          <label>
            المادة
            <select name="courseId" value={filter.courseId} onChange={changeField} disabled={courses.loading || Boolean(courses.error)}>
              <option value="">كل المواد</option>
              {courses.rows.map((course) => (
                <option value={course.id} key={course.id}>{course.courseName} ({course.courseCode})</option>
              ))}
            </select>
          </label>
          <label>
            الطالب
            <select name="studentId" value={filter.studentId} onChange={changeField} disabled={students.loading || Boolean(students.error)}>
              <option value="">كل الطلبة</option>
              {students.rows.map((student) => (
                <option value={student.id} key={student.id}>{student.fullName} ({student.studentCode})</option>
              ))}
            </select>
          </label>
          <label>من تاريخ<input type="date" name="from" max={filter.to || undefined} value={filter.from} onChange={changeField} /></label>
          <label>لحد تاريخ<input type="date" name="to" min={filter.from || undefined} value={filter.to} onChange={changeField} /></label>
          <button type="submit" className="btn-primary">عرض التقرير</button>
        </form>
      </section>
      <ReportResult key={applied.version + ':' + page} params={applied.params} page={page} goTo={setPage} />
    </div>
  );
}
