import React, { useEffect, useState } from "react";
import "../../styles/admin/AdminComplain.css";
import { Chart } from "chart.js/auto";

const AdminComplain = () => {
  const [complaints, setComplaints] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const [stats, setStats] = useState({ Pending: 0, Assigned: 0, Solved: 0 });
  const [months, setMonths] = useState(new Array(12).fill(0));

  // 1. FETCH DATA FROM MYSQL
  const fetchComplaints = async () => {
    try {
      const res = await fetch(`${BASE_URL}/admin/complaints`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setComplaints(data);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  /* FILTER DATA */
  const getFiltered = () => {
    const today = new Date();
    return complaints.filter(c => {
      const d = new Date(c.created_at);
      const searchStr = (c.username + c.room_number + c.category + c.description).toLowerCase();

      if (!searchStr.includes(search.toLowerCase())) return false;
      if (filter === "today" && d.toDateString() !== today.toDateString()) return false;
      if (filter === "week") {
        const diff = (today - d) / (1000 * 60 * 60 * 24);
        if (diff > 7) return false;
      }
      if (filter === "month" && d.getMonth() !== today.getMonth()) return false;
      return true;
    });
  };

  const filtered = getFiltered();

  /* STATS + CHART DATA */
  useEffect(() => {
    let stat = { Pending: 0, Assigned: 0, Solved: 0 };
    let m = new Array(12).fill(0);
    complaints.forEach(c => {
      const s = c.status.charAt(0).toUpperCase() + c.status.slice(1);
      if (stat[s] !== undefined) stat[s]++;
      m[new Date(c.created_at).getMonth()]++;
    });
    setStats(stat);
    setMonths(m);
  }, [complaints]);

  /* CHART RENDERING */
  useEffect(() => {
    const barCtx = document.getElementById("barChart");
    const pieCtx = document.getElementById("pieChart");

    const bar = new Chart(barCtx, {
      type: "bar",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [{ label: "Complaints", data: months, backgroundColor: "#00c6ff" }]
      }
    });

    const pie = new Chart(pieCtx, {
      type: "pie",
      data: {
        labels: Object.keys(stats),
        datasets: [{ data: Object.values(stats), backgroundColor: ["#ff4d4d", "#ffcc00", "#00ff88"] }]
      }
    });

    return () => {
      bar.destroy();
      pie.destroy();
    };
  }, [months, stats]);

  // 2. UPDATE STATUS ONLY
  const updateComplaint = async (id, newStatus) => {
    try {
      const res = await fetch(`${BASE_URL}/admin/complaints/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }), // Removed remark from payload
        credentials: "include",
      });
      if (res.ok) {
        fetchComplaints();
      }
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  const del = async (id) => {
    if (!window.confirm("Delete this complaint?")) return;
    try {
      const res = await fetch(`${BASE_URL}/admin/complaints/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) fetchComplaints();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div className="complaint-container">
      <h2 style={{ color: 'white' }}>Complaint Management</h2>

      <div className="top">
        <input type="text" placeholder="Search..." onChange={(e) => setSearch(e.target.value)} />
        <select onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
        {/* Remark input removed from here */}
      </div>

      <div className="cards">
        <div className="card">Total <h2>{complaints.length}</h2></div>
        <div className="card">Pending <h2>{stats.Pending}</h2></div>
        <div className="card">Assigned <h2>{stats.Assigned}</h2></div>
        <div className="card">Solved <h2>{stats.Solved}</h2></div>
      </div>

      <table className="complaint-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Room</th>
            <th>Category</th>
            <th>Description</th>
            <th>Photo</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((c) => (
            <tr key={c.id}>
              <td>{c.username}</td>
              <td>{c.room_number}</td>
              <td>{c.category}</td>
              <td>{c.description}</td>
              <td>
                {c.photo ? (
                  <img src={c.photo} alt="issue" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                ) : "No Image"}
              </td>
              <td><span className={`status ${(c.status || "Pending").toLowerCase()}`}>{c.status}</span></td>
              {/* Remark table cell removed from here */}
              <td>
                <div className="action-btns">
                  <button className="assign" onClick={() => updateComplaint(c.id, "Assigned")}>Assign</button>
                  <button className="solve" onClick={() => updateComplaint(c.id, "Solved")}>Solve</button>
                  <button className="delete" onClick={() => del(c.id)}>🗑</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="chart-section">
        <div className="chart-box"><h3>Monthly Trend</h3><canvas id="barChart"></canvas></div>
        <div className="chart-box"><h3>Status Breakdown</h3><canvas id="pieChart"></canvas></div>
      </div>
    </div>
  );
};

export default AdminComplain;