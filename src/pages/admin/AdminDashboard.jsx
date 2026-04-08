import React, { useEffect, useRef, useState } from "react";
import "../../styles/admin/AdminDashboard.css";
import { Chart } from "chart.js/auto";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
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
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h3>Admin Panel</h3>
        </div>
        <div className="sidebar-menu-items">
          <div className="menu active">🏠 Dashboard</div>
          <div className="menu" onClick={() => navigate("/AdminProfile")}>👤 Profile</div>
          <div className="menu" onClick={() => navigate("/AdminStudents")}>👥 Students</div>
          <div className="menu">🛏 Rooms</div>
          <div className="menu">💰 Fees</div>
          <div className="menu">⚠ Complaints</div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <h2>Hostel Analytics</h2>
          <div className="header-actions">
            <button className="btn logout" onClick={() => navigate("/login")}>Logout</button>
          </div>
        </header>

        <div className="cards">
          <div className="card">
            <span>Total Students</span>
            <h2>{stats.students}</h2>
          </div>
          <div className="card">
            <span>Occupancy</span>
            <h2>{stats.rooms} Rooms</h2>
          </div>
          <div className="card">
            <span>Revenue</span>
            <h2>₹{stats.fees.toLocaleString('en-IN')}</h2>
          </div>
          <div className="card">
            <span>Active Complaints</span>
            <h2>{stats.complaints}</h2>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="chart-box">
            <h3>Usage Statistics</h3>
            <canvas ref={canvasRef}></canvas>
          </div>

          <div className="table-box">
            <h3>Recent Registrations</h3>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Course</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.list.map((s, index) => (
                  <tr key={index}>
                    <td>{s.firstname} {s.lastname}</td>
                    <td>{s.course || "N/A"}</td>
                    <td><span style={{ color: "#22c55e" }}>New</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;