import { useEffect, useState } from 'react';
import StudentsPage from './StudentsPage';
import CoursesPage from './CoursesPage';
import EnrollmentsPage from './EnrollmentsPage';
import AttendancePage from './AttendancePage';
import ReportsPage from './ReportsPage';
import './App.css';

function Dashboard() {
  return (
    <div>
      <header className="topbar"><h1>نظام حضور الطلبة</h1></header>
      <main className="dashboard-grid">
        {pages.filter(({ id }) => id !== 'home').map(({ id, label }) => (
          <a className="card dashboard-link" key={id} href={'#' + id}>{label}</a>
        ))}
      </main>
    </div>
  );
}

const pages = [
  { id: 'home', label: 'الرئيسية', Component: Dashboard },
  { id: 'students', label: 'الطلبة', Component: StudentsPage },
  { id: 'courses', label: 'المواد', Component: CoursesPage },
  { id: 'enrollments', label: 'التسجيل في المواد', Component: EnrollmentsPage },
  { id: 'attendance', label: 'تسجيل الحضور', Component: AttendancePage },
  { id: 'reports', label: 'السجل والتقارير', Component: ReportsPage },
];

export default function App() {
  const [hash, setHash] = useState(window.location.hash);

  useEffect(() => {
    const handleHash = () => setHash(window.location.hash);
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const page = pages.find(({ id }) => hash === '#' + id) ?? pages.find(({ id }) => id === 'students');
  const Page = page.Component;

  return (
    <div className="app-shell" dir="rtl">
      <nav className="app-nav" aria-label="أقسام النظام">
        {pages.map(({ id, label }) => (
          <a key={id} href={'#' + id} aria-current={page.id === id ? 'page' : undefined}>{label}</a>
        ))}
      </nav>
      <Page />
    </div>
  );
}
