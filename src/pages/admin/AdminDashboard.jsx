import React, { useEffect, useRef, useState } from "react";
import "../../styles/admin/AdminDashboard.css";
import { Chart } from "chart.js/auto";

const AdminDashboard = () => {
  const chartRef = useRef(null);
  const canvasRef = useRef(null);
  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  // Standardized state for all dashboard statistics
  const [stats, setStats] = useState({
    students: 0,
    rooms: 0,
    fees: 0,
    complaints: 0,
    list: [],
  });

  const [loading, setLoading] = useState(true);

  // States for UI control and adding new students
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", room: "", gender: "" });

  // 1. FETCH DATA FROM BACKEND
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${BASE_URL}/admin/dashboard-stats`, {
          credentials: "include"
        });
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [BASE_URL]);

  // 2. CHART LOGIC (Re-renders when stats or loading status changes)
  useEffect(() => {
    if (!canvasRef.current || loading) return;

    const ctx = canvasRef.current;

    // Destroy previous instance to prevent "Canvas is already in use" errors
    if (chartRef.current) chartRef.current.destroy();

    chartRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Students", "Rooms", "Complaints"],
        datasets: [{
          label: "Hostel Overview",
          data: [stats.students, stats.rooms, stats.complaints],
          backgroundColor: ["#00c6ff", "#22c55e", "#ef4444"],
        }],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { labels: { color: "white" } }
        },
        scales: {
          x: { ticks: { color: "white" } },
          y: { ticks: { color: "white" }, beginAtZero: true },
        },
      },
    });

    return () => chartRef.current?.destroy();
  }, [stats, loading]);

  // Function to handle adding a new student
  const saveStudent = async () => {
    try {
      const response = await fetch(`${BASE_URL}/admin/add-student`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
        credentials: "include"
      });

      if (response.ok) {
        alert("Student added successfully!");
        setShowModal(false);
        setForm({ name: "", room: "", gender: "" });
        // Optional: Re-fetch stats to update the UI
      }
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  if (loading) return <div className="loading">Loading Dashboard Data...</div>;

  return (
    <div className="admin-dashboard-content">
      {/* ACTION HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: 'white' }}>Dashboard Overview</h2>
        <button className="btn" onClick={() => setShowModal(true)}>+ Add Student</button>
      </div>

      {/* CARDS */}
      <div className="cards">
        <div className="card">
          <span>Total Students</span>
          <h2>{stats.students}</h2>
        </div>
        <div className="card">
          <span>Rooms Occupied</span>
          <h2>{stats.rooms}</h2>
        </div>
        <div className="card">
          <span>Fees Collected</span>
          <h2>₹{stats.fees}</h2>
        </div>
        <div className="card">
          <span>Complaints</span>
          <h2>{stats.complaints}</h2>
        </div>
      </div>

      {/* GRID LAYOUT */}
      <div className="dashboard-grid">
        <div className="chart-box">
          <h3>Hostel Overview</h3>
          <canvas ref={canvasRef}></canvas>
        </div>

        <div className="table-box">
          <h3>Recent Student Records</h3>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Room</th>
                <th>Fees Status</th>
              </tr>
            </thead>
            <tbody>
              {stats.list && stats.list.length > 0 ? (
                stats.list.map((s, index) => (
                  <tr key={index}>
                    <td>{s.name}</td>
                    <td>{s.room}</td>
                    <td>
                      <span style={{ color: s.fees === "Paid" ? "#22c55e" : "#ef4444" }}>
                        {s.fees}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center', padding: '20px' }}>No records found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD STUDENT MODAL */}
      {showModal && (
        <div className="modal" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div className="modal-box" style={{ background: '#1e293b', padding: '30px', borderRadius: '15px', color: 'white', width: '380px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
            <span className="close" onClick={() => setShowModal(false)} style={{ float: 'right', cursor: 'pointer', fontSize: '20px' }}>✖</span>
            <h3 style={{ marginBottom: '20px', fontSize: '1.5rem' }}>Add New Student</h3>

            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Full Name</label>
            <input
              style={{ width: '100%', marginBottom: '15px', padding: '10px', borderRadius: '5px', border: 'none', color: '#000' }}
              placeholder="Enter name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Room Number</label>
            <input
              style={{ width: '100%', marginBottom: '15px', padding: '10px', borderRadius: '5px', border: 'none', color: '#000' }}
              placeholder="e.g. 101"
              value={form.room}
              onChange={(e) => setForm({ ...form, room: e.target.value })}
            />

            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Gender</label>
            <select
              style={{ width: '100%', marginBottom: '25px', padding: '10px', borderRadius: '5px', border: 'none', color: '#000' }}
              value={form.gender}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
            >
              <option value="">Select Gender</option>
              <option>Male</option>
              <option>Female</option>
            </select>

            <button className="btn" style={{ width: '100%', padding: '12px', fontWeight: 'bold' }} onClick={saveStudent}>
              Save Student Record
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;