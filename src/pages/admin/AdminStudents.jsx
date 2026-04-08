import React, { useState, useEffect } from "react";
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
    <div className="student-management-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
         <h2 style={{ color: 'white' }}>Student Management</h2>
      </div>

      {/* STAT CARDS */}
      <div className="cards">
        <div className="card">
          <span>Total Students</span>
          <h2>{total}</h2>
        </div>
        <div className="card">
          <span>Male</span>
          <h2 style={{ color: "#00c6ff" }}>{male}</h2>
        </div>
        <div className="card">
          <span>Female</span>
          <h2 style={{ color: "#ff4bb4" }}>{female}</h2>
        </div>
      </div>

      {/* TOP / ACTIONS */}
      <div className="table-actions">
        <input
          type="text"
          placeholder="Search student by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <button className="btn" onClick={() => setShowModal(true)}>
          + Add New Student
        </button>
      </div>

      {/* TABLE */}
      <div className="table-container">
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
            {filtered.map((s, i) => (
              <tr key={i}>
                <td>{s.name}</td>
                <td>{s.room}</td>
                <td>{s.gender}</td>
                <td>
                  <span className={`status ${s.status.toLowerCase()}`}>
                    {s.status}
                  </span>
                </td>
                <td className="action">
                  {s.status === "Pending" && (
                    <>
                      <button className="approve" title="Approve" onClick={() => approve(i)}>✔</button>
                      <button className="reject" title="Reject" onClick={() => reject(i)}>✖</button>
                    </>
                  )}
                  <button className="delete" title="Delete" onClick={() => del(i)}>🗑</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p style={{ textAlign: 'center', color: '#888', padding: '20px' }}>No students found.</p>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal">
          <div className="modal-box">
            <span className="close" onClick={() => setShowModal(false)}>✖</span>
            <h3>Add Student</h3>

            <input
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              placeholder="Room Number"
              value={form.room}
              onChange={(e) => setForm({ ...form, room: e.target.value })}
            />
            <select
              value={form.gender}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
            >
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