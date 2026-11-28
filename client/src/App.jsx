import { useEffect, useMemo, useState } from "react";
import "./App.css";

const INITIAL_STUDENTS = [
  {
    id: "STU-2026-001",
    fullName: "Ahmed Hassan Mahmoud",
    email: "ahmed.hassan@student.edu.eg",
    department: "Computer Science",
    level: "Level 3",
    gpa: 3.65,
    attendanceRate: 94,
    status: "Active",
  },
  {
    id: "STU-2026-002",
    fullName: "Mariam Khaled Samir",
    email: "mariam.khaled@student.edu.eg",
    department: "Information Systems",
    level: "Level 2",
    gpa: 3.82,
    attendanceRate: 98,
    status: "Active",
  },
  {
    id: "STU-2026-003",
    fullName: "Youssef Tarek Ali",
    email: "youssef.tarek@student.edu.eg",
    department: "Artificial Intelligence",
    level: "Level 4",
    gpa: 3.21,
    attendanceRate: 81,
    status: "At Risk",
  },
  {
    id: "STU-2026-004",
    fullName: "Salma Mohamed Nabil",
    email: "salma.mohamed@student.edu.eg",
    department: "Software Engineering",
    level: "Level 3",
    gpa: 3.91,
    attendanceRate: 96,
    status: "Active",
  },
];

const EMPTY_FORM = {
  id: "",
  fullName: "",
  email: "",
  department: "Computer Science",
  level: "Level 1",
  gpa: "3.50",
  attendanceRate: "90",
  status: "Active",
};

// لو عندك Backend API جاهز، غيّر الرابط ده وخلي USE_LIVE_API = true
const API_BASE_URL = "http://localhost:5000/api/students";
const USE_LIVE_API = false;

export default function App() {
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [toastMsg, setToastMsg] = useState("");

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  useEffect(() => {
    if (!USE_LIVE_API) return;
    const fetchStudents = async () => {
      setLoading(true);
      setErrorMsg("");
      try {
        const res = await fetch(API_BASE_URL);
        if (!res.ok) throw new Error("فشل تحميل بيانات الطلاب من السيرفر");
        const data = await res.json();
        setStudents(Array.isArray(data) ? data : []);
      } catch (err) {
        setErrorMsg(err.message || "حدث خطأ أثناء الاتصال بالباك إند");
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const filteredStudents = useMemo(() => {
    return students.filter((st) => {
      const q = searchTerm.trim().toLowerCase();
      const matchesSearch =
        !q ||
        st.id.toLowerCase().includes(q) ||
        st.fullName.toLowerCase().includes(q) ||
        st.email.toLowerCase().includes(q);
      const matchesDept =
        departmentFilter === "All" || st.department === departmentFilter;
      const matchesStatus =
        statusFilter === "All" || st.status === statusFilter;
      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [students, searchTerm, departmentFilter, statusFilter]);

  const stats = useMemo(() => {
    const total = students.length;
    const active = students.filter((s) => s.status === "Active").length;
    const avgGpa =
      total > 0
        ? (
            students.reduce((acc, s) => acc + Number(s.gpa || 0), 0) / total
          ).toFixed(2)
        : "0.00";
    const avgAttendance =
      total > 0
        ? Math.round(
            students.reduce((acc, s) => acc + Number(s.attendanceRate || 0), 0) /
              total
          )
        : 0;
    return { total, active, avgGpa, avgAttendance };
  }, [students]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!formData.fullName.trim() || !formData.email.trim()) {
      setErrorMsg("من فضلك أدخل اسم الطالب والبريد الإلكتروني.");
      return;
    }

    const payload = {
      id:
        formData.id.trim() ||
        `STU-2026-${String(Math.floor(100 + Math.random() * 900))}`,
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      department: formData.department,
      level: formData.level,
      gpa: Number(formData.gpa) || 0,
      attendanceRate: Math.min(100, Math.max(0, Number(formData.attendanceRate) || 0)),
      status: formData.status,
    };

    try {
      if (USE_LIVE_API) {
        const url = editingId ? `${API_BASE_URL}/${editingId}` : API_BASE_URL;
        const method = editingId ? "PUT" : "POST";
        const res = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("تعذر حفظ بيانات الطالب في قاعدة البيانات");
      }

      if (editingId) {
        setStudents((prev) =>
          prev.map((item) => (item.id === editingId ? payload : item))
        );
        showToast("تم تحديث بيانات الطالب بنجاح");
      } else {
        setStudents((prev) => [payload, ...prev]);
        showToast("تمت إضافة الطالب بنجاح");
      }

      setEditingId(null);
      setFormData(EMPTY_FORM);
    } catch (err) {
      setErrorMsg(err.message || "حصل خطأ أثناء الحفظ");
    }
  };

  const handleEdit = (student) => {
    setEditingId(student.id);
    setFormData({
      id: student.id,
      fullName: student.fullName,
      email: student.email,
      department: student.department,
      level: student.level,
      gpa: String(student.gpa),
      attendanceRate: String(student.attendanceRate),
      status: student.status,
    });
    setErrorMsg("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setErrorMsg("");
  };

  const handleDelete = async (id) => {
    try {
      if (USE_LIVE_API) {
        const res = await fetch(`${API_BASE_URL}/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("تعذر حذف الطالب من السيرفر");
      }
      setStudents((prev) => prev.filter((item) => item.id !== id));
      if (editingId === id) handleCancelEdit();
      showToast("تم حذف سجل الطالب");
    } catch (err) {
      setErrorMsg(err.message || "حصل خطأ أثناء الحذف");
    }
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <span className="badge">T6 • Student Management</span>
          <h1>Student Management Dashboard</h1>
          <p className="subtitle">
            إدارة سجلات الطلاب، المعدل التراكمي، ونسب الحضور ضمن نظام قاعدة البيانات
          </p>
        </div>
        {toastMsg && <div className="toast">{toastMsg}</div>}
      </header>

      <section className="stats-grid">
        <div className="stat-card">
          <span>إجمالي الطلاب</span>
          <strong>{stats.total}</strong>
        </div>
        <div className="stat-card">
          <span>الطلاب النشطون</span>
          <strong>{stats.active}</strong>
        </div>
        <div className="stat-card">
          <span>متوسط GPA</span>
          <strong>{stats.avgGpa}</strong>
        </div>
        <div className="stat-card">
          <span>متوسط الحضور</span>
          <strong>{stats.avgAttendance}%</strong>
        </div>
      </section>

      {errorMsg && <div className="alert-error">{errorMsg}</div>}

      <main className="workspace-grid">
        <section className="card form-card">
          <h2>{editingId ? "تعديل بيانات طالب" : "إضافة طالب جديد"}</h2>
          <form onSubmit={handleSubmit} className="student-form">
            <label>
              كود الطالب (Student ID)
              <input
                type="text"
                name="id"
                placeholder="مثال: STU-2026-005"
                value={formData.id}
                onChange={handleChange}
                disabled={Boolean(editingId)}
              />
            </label>

            <label>
              الاسم الكامل *
              <input
                type="text"
                name="fullName"
                placeholder="اكتب اسم الطالب"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              البريد الإلكتروني *
              <input
                type="email"
                name="email"
                placeholder="student@domain.edu"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </label>

            <div className="two-cols">
              <label>
                القسم / التخصص
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                >
                  <option value="Computer Science">Computer Science</option>
                  <option value="Information Systems">Information Systems</option>
                  <option value="Artificial Intelligence">Artificial Intelligence</option>
                  <option value="Software Engineering">Software Engineering</option>
                </select>
              </label>

              <label>
                المستوى الدراسي
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                >
                  <option value="Level 1">Level 1</option>
                  <option value="Level 2">Level 2</option>
                  <option value="Level 3">Level 3</option>
                  <option value="Level 4">Level 4</option>
                </select>
              </label>
            </div>

            <div className="two-cols">
              <label>
                GPA
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="4"
                  name="gpa"
                  value={formData.gpa}
                  onChange={handleChange}
                />
              </label>

              <label>
                نسبة الحضور (%)
                <input
                  type="number"
                  min="0"
                  max="100"
                  name="attendanceRate"
                  value={formData.attendanceRate}
                  onChange={handleChange}
                />
              </label>
            </div>

            <label>
              الحالة الأكاديمية
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Active">Active</option>
                <option value="At Risk">At Risk</option>
                <option value="Suspended">Suspended</option>
              </select>
            </label>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                {editingId ? "حفظ التعديلات" : "إضافة الطالب"}
              </button>
              {editingId && (
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleCancelEdit}
                >
                  إلغاء
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="card table-card">
          <div className="toolbar">
            <input
              type="text"
              className="search-input"
              placeholder="ابحث بالاسم أو الكود أو الإيميل..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
            >
              <option value="All">كل الأقسام</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Information Systems">Information Systems</option>
              <option value="Artificial Intelligence">Artificial Intelligence</option>
              <option value="Software Engineering">Software Engineering</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">كل الحالات</option>
              <option value="Active">Active</option>
              <option value="At Risk">At Risk</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>

          {loading ? (
            <p className="empty-state">جاري تحميل البيانات...</p>
          ) : filteredStudents.length === 0 ? (
            <p className="empty-state">لا توجد نتائج مطابقة للبحث أو الفلترة.</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>الاسم</th>
                    <th>القسم</th>
                    <th>المستوى</th>
                    <th>GPA</th>
                    <th>الحضور</th>
                    <th>الحالة</th>
                    <th>إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((st) => (
                    <tr key={st.id}>
                      <td className="mono">{st.id}</td>
                      <td>
                        <div className="student-name">{st.fullName}</div>
                        <div className="student-email">{st.email}</div>
                      </td>
                      <td>{st.department}</td>
                      <td>{st.level}</td>
                      <td>{Number(st.gpa).toFixed(2)}</td>
                      <td>{st.attendanceRate}%</td>
                      <td>
                        <span
                          className={`status-pill status-${st.status
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                        >
                          {st.status}
                        </span>
                      </td>
                      <td className="actions-cell">
                        <button
                          type="button"
                          className="btn-edit"
                          onClick={() => handleEdit(st)}
                        >
                          تعديل
                        </button>
                        <button
                          type="button"
                          className="btn-delete"
                          onClick={() => handleDelete(st.id)}
                        >
                          حذف
                        </button>
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