import React, { useEffect, useRef, useState } from "react";
import "../../styles/admin/AdminDashboard.css";
import { Chart } from "chart.js/auto";

const AdminDashboard = () => {
  const chartRef = useRef(null);
  const canvasRef = useRef(null);
  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const [stats, setStats] = useState({
    students: 0,
    rooms: 0,
    fees: 0,
    complaints: 0,
    list: [],
  });

  const [loading, setLoading] = useState(true);

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

  // 2. CHART LOGIC (Runs whenever stats update)
  useEffect(() => {
    if (!canvasRef.current || loading) return;

    const ctx = canvasRef.current;
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
        plugins: { legend: { labels: { color: "white" } } },
        scales: {
          x: { ticks: { color: "white" } },
          y: { ticks: { color: "white" }, beginAtZero: true },
        },
      },
    });

    return () => chartRef.current?.destroy();
  }, [stats, loading]);

  if (loading) return <div className="loading">Loading Dashboard Data...</div>;

  return (
    <div className="admin-dashboard-content">
      {/* ACTION HEADER (Specific to Dashboard) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
         <h2 style={{ color: 'white' }}>Dashboard Overview</h2>
         <button className="btn" onClick={() => setShowModal(true)}>+ Add Student</button>
      </div>

      {/* CARDS */}
      <div className="cards">
        <div className="card">
          <span>Total Students</span>
          <h2>{data.students}</h2>
        </div>
        <div className="card">
          <span>Rooms Occupied</span>
          <h2>{data.rooms}</h2>
        </div>
        <div className="card">
          <span>Fees Collected</span>
          <h2>₹{data.fees}</h2>
        </div>
        <div className="card">
          <span>Complaints</span>
          <h2>{data.complaints}</h2>
        </div>
      </div>

      {/* GRID */}
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
                <th>Fees</th>
              </tr>
            </thead>
            <tbody>
              {data.list.map((s, index) => (
                <tr key={index}>
                  <td>{s.name}</td>
                  <td>{s.room}</td>
                  <td>
                    <span style={{ color: s.fees === "Paid" ? "#22c55e" : "#ef4444" }}>
                      {s.fees}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal">
          <div className="modal-box">
            <span className="close" onClick={() => setShowModal(false)}>✖</span>
            <h3>Add New Student</h3>
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

export default AdminDashboard;