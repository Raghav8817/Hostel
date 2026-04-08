import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/admin/AdminStudents.css";

const AdminStudents = () => {
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // 1. LOAD DATA FROM DATABASE
  const fetchStudents = async () => {
    try {
      const response = await fetch(`${BASE_URL}/admin/students`, { credentials: "include" });
      if (response.ok) {
        const data = await response.json();
        setStudents(data);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // 2. UPDATE STATUS (Approve/Reject)
  const updateStatus = async (username, newStatus) => {
    try {
      const response = await fetch(`${BASE_URL}/admin/students/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, status: newStatus }),
        credentials: "include",
      });

      if (response.ok) {
        // Update local state without re-fetching
        setStudents(students.map(s => s.username === username ? { ...s, status: newStatus } : s));
      }
    } catch (err) {
      console.error("Status update error:", err);
    }
  };

  // 3. DELETE STUDENT
  const deleteStudent = async (username) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;

    try {
      const response = await fetch(`${BASE_URL}/admin/students/${username}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        setStudents(students.filter(s => s.username !== username));
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  /* SEARCH FILTER */
  const filtered = students.filter((s) =>
    `${s.firstname} ${s.lastname}`.toLowerCase().includes(search.toLowerCase())
  );

  /* DYNAMIC COUNTS */
  const total = students.length;
  const male = students.filter(s => s.gender?.toLowerCase() === "male").length;
  const female = students.filter(s => s.gender?.toLowerCase() === "female").length;

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h3>Admin Panel</h3>
        </div>
        <div className="sidebar-menu-items">
          <div className="menu" onClick={() => navigate("/AdminDashboard")}>🏠 Dashboard</div>
          <div className="menu" onClick={() => navigate("/AdminProfile")}>👤 Profile</div>
          <div className="menu active">👥 Students</div>
          <div className="menu">🛏 Rooms</div>
          <div className="menu">💰 Fees</div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <h2>Student Management</h2>
          <button className="btn logout" onClick={() => navigate("/login")}>Logout</button>
        </header>

        <div className="cards">
          <div className="card">
            <span>Total Students</span>
            <h2>{total}</h2>
          </div>
          <div className="card">
            <span>Male</span>
            <h2>{male}</h2>
          </div>
          <div className="card">
            <span>Female</span>
            <h2>{female}</h2>
          </div>
        </div>

        <div className="table-actions">
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="table-container">
          {loading ? <p>Loading Students...</p> : (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Username</th>
                  <th>Gender</th>
                  <th>Course</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.username}>
                    <td>{s.firstname} {s.lastname}</td>
                    <td>{s.username}</td>
                    <td>{s.gender}</td>
                    <td>{s.course || "N/A"}</td>
                    <td>
                      <span className={`status ${(s.status || 'pending').toLowerCase()}`}>
                        {s.status || 'Pending'}
                      </span>
                    </td>
                    <td className="action">
                      <button className="approve" onClick={() => updateStatus(s.username, "Approved")}>✔</button>
                      <button className="reject" onClick={() => updateStatus(s.username, "Rejected")}>✖</button>
                      <button className="delete" onClick={() => deleteStudent(s.username)}>🗑</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminStudents;