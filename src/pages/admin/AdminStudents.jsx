import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/admin/AdminStudents.css";

const AdminStudents = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    name: "",
    room: "",
    gender: "",
  });

  /* LOAD DATA */
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("students")) || [
      { name: "Rahul Sharma", room: "101", gender: "Male", status: "Approved" },
      { name: "Aman Verma", room: "102", gender: "Male", status: "Pending" },
      { name: "Priya Sharma", room: "201", gender: "Female", status: "Approved" },
      { name: "Neha Gupta", room: "202", gender: "Female", status: "Pending" },
    ];
    setStudents(saved);
  }, []);

  /* SAVE TO STORAGE */
  useEffect(() => {
    localStorage.setItem("students", JSON.stringify(students));
  }, [students]);

  /* ADD STUDENT */
  const saveStudent = () => {
    if (!form.name || !form.room || !form.gender) {
      alert("Please fill all fields!");
      return;
    }

    setStudents([
      ...students,
      { ...form, status: "Pending" }
    ]);

    setForm({ name: "", room: "", gender: "" });
    setShowModal(false);
  };

  /* ACTIONS */
  const approve = (i) => {
    const updated = [...students];
    updated[i].status = "Approved";
    setStudents(updated);
  };

  const reject = (i) => {
    const updated = [...students];
    updated[i].status = "Rejected";
    setStudents(updated);
  };

  const del = (i) => {
    const updated = students.filter((_, index) => index !== i);
    setStudents(updated);
  };

  /* FILTER */
  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  /* COUNTS */
  const total = students.length;
  const male = students.filter(s => s.gender === "Male").length;
  const female = students.filter(s => s.gender === "Female").length;

  return (
    <div className="dashboard-container">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <img src="https://i.pravatar.cc/100" alt="profile" />
          <h3>Admin Panel</h3>
        </div>
        <div className="sidebar-menu-items">
          <div className="menu" onClick={() => navigate("/AdminDashboard")}>🏠 Dashboard</div>
          <div className="menu" onClick={() => navigate("/AdminProfile")}>👤 Profile</div>
          <div className="menu active" onClick={() => navigate("/AdminStudents")}>👥 Students</div>
          <div className="menu">🛏 Rooms</div>
          <div className="menu">💰 Fees</div>
          <div className="menu">⚠ Complaints</div>
          <div className="menu">👥 Staff</div>

        </div>
      </aside>

      {/* MAIN */}
      <main className="main">
        {/* TOPBAR */}
        <header className="topbar">
          <h2>Student Management</h2>
          <div className="header-actions">
            <button className="btn logout">Logout</button>
          </div>
        </header>

        {/* CARDS */}
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

        {/* TOP / ACTIONS */}
        <div className="table-actions">
          <input
            type="text"
            placeholder="Search student..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn" onClick={() => setShowModal(true)}>
            + Add Student
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
                    <button className="approve" onClick={() => approve(i)}>✔</button>
                    <button className="reject" onClick={() => reject(i)}>✖</button>
                    <button className="delete" onClick={() => del(i)}>🗑</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

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
              placeholder="Room"
              value={form.room}
              onChange={(e) => setForm({ ...form, room: e.target.value })}
            />
            <select
              value={form.gender}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
            >
              <option value="">Select Gender</option>
              <option>Male</option>
              <option>Female</option>
            </select>

            <button className="btn" onClick={saveStudent}>Save Student</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStudents;
