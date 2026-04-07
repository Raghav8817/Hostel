import React, { useState, useEffect } from "react";
import "../../styles/admin/AdminStudents.css";

const AdminStudents = () => {
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