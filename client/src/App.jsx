import { useEffect, useState } from 'react';
import StudentsPage from './StudentsPage';
import CoursesPage from './CoursesPage';
import EnrollmentsPage from './EnrollmentsPage';
import './App.css';

const pages = [
  { id: 'students', label: 'الطلبة', Component: StudentsPage },
  { id: 'courses', label: 'المواد', Component: CoursesPage },
  { id: 'enrollments', label: 'التسجيل في المواد', Component: EnrollmentsPage },
];

export default function App() {
  const [hash, setHash] = useState(window.location.hash);

  useEffect(() => {
    const handleHash = () => setHash(window.location.hash);
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const page = pages.find(({ id }) => hash === '#' + id) ?? pages[0];
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
