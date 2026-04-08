import React, { useState, useEffect } from "react";
import "../../styles/admin/AdminStudents.css";
import { useNavigate } from "react-router-dom";

const AdminStudents = () => {
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  // 1. STATE DEFINITIONS
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Missing states that caused the crash
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", room: "", gender: "" });

  // 2. LOAD DATA FROM DATABASE
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

  // 3. UPDATE STATUS (Approve/Reject)
  const updateStatus = async (username, newStatus) => {
    try {
      const response = await fetch(`${BASE_URL}/admin/students/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, status: newStatus }),
        credentials: "include",
      });

      if (response.ok) {
        setStudents(prev => prev.map(s => s.username === username ? { ...s, status: newStatus } : s));
      }
    } catch (err) {
      console.error("Status update error:", err);
    }
  };

  // 4. ADD NEW STUDENT
  const saveStudent = async () => {
    try {
      const response = await fetch(`${BASE_URL}/admin/students/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        credentials: "include",
      });

      if (response.ok) {
        alert("Student added successfully!");
        setShowModal(false);
        setForm({ name: "", room: "", gender: "" });
        fetchStudents(); // Refresh list
      }
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  // 5. DELETE STUDENT
  const deleteStudent = async (username) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    try {
      const response = await fetch(`${BASE_URL}/admin/students/${username}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        setStudents(prev => prev.filter(s => s.username !== username));
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  /* SEARCH FILTER */
  const filtered = students.filter((s) =>
    `${s.firstname || ""} ${s.lastname || ""} ${s.name || ""}`.toLowerCase().includes(search.toLowerCase())
  );

  /* DYNAMIC COUNTS */
  const total = students.length;
  const male = students.filter(s => s.gender?.toLowerCase() === "male").length;
  const female = students.filter(s => s.gender?.toLowerCase() === "female").length;

  if (loading) return <div style={{ color: 'var(--text-primary)', padding: '20px' }}>Loading Students...</div>;

  return (
    <div className="student-management-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: 'var(--text-primary)' }}>Student Management</h2>
      </div>

      <div className="cards">
        <div className="card"><span>Total Students</span><h2>{total}</h2></div>
        <div className="card"><span>Male</span><h2 style={{ color: "#00c6ff" }}>{male}</h2></div>
        <div className="card"><span>Female</span><h2 style={{ color: "#ff4bb4" }}>{female}</h2></div>
      </div>

      <div className="table-actions">
        <input
          type="text"
          placeholder="Search student by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <button className="btn" onClick={() => setShowModal(true)}>+ Add New Student</button>
      </div>

      <div className="table-container table-responsive">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Room</th>
              <th>Gender</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.username}>
                <td>{s.firstname ? `${s.firstname} ${s.lastname}` : s.name}</td>
                <td>{s.room || "N/A"}</td>
                <td>{s.gender}</td>
                <td><span className={`status ${(s.status || "").toLowerCase()}`}>{s.status}</span></td>
                <td className="action">
                  {s.status === "Pending" && (
                    <>
                      <button className="approve" onClick={() => updateStatus(s.username, "Approved")}>✔</button>
                      <button className="reject" onClick={() => updateStatus(s.username, "Rejected")}>✖</button>
                    </>
                  )}
                  <button className="delete" onClick={() => deleteStudent(s.username)}>🗑</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-box">
            <span className="close" onClick={() => setShowModal(false)}>✖</span>
            <h3>Add Student</h3>
            <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input placeholder="Room Number" value={form.room} onChange={(e) => setForm({ ...form, room: e.target.value })} />
            <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <button className="btn" onClick={saveStudent}>Save Student</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStudents;