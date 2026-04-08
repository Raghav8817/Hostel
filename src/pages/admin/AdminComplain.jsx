import React, { useEffect, useState } from "react";
import "../../styles/admin/AdminComplain.css";
import { Chart } from "chart.js/auto";

const AdminComplain = () => {
  const [complaints, setComplaints] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [staff, setStaff] = useState("");

  const [stats, setStats] = useState({
    Pending: 0,
    Assigned: 0,
    Solved: 0
  });

  const [months, setMonths] = useState(new Array(12).fill(0));

  /* LOAD DATA */
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("complaints")) || [
      { name: "Rahul", room: "101", type: "Cleaning", msg: "Dirty", img: "https://via.placeholder.com/100", status: "Pending", date: "2026-04-01" },
      { name: "Priya", room: "202", type: "Electric", msg: "Light issue", img: "https://via.placeholder.com/100", status: "Assigned", date: "2026-04-02" },
      { name: "Aman", room: "103", type: "Water", msg: "No water", img: "https://via.placeholder.com/100", status: "Solved", date: "2026-03-25" }
    ];
    setComplaints(data);
  }, []);

  /* SAVE */
  const updateStorage = (data) => {
    setComplaints(data);
    localStorage.setItem("complaints", JSON.stringify(data));
  };

  /* FILTER DATA */
  const getFiltered = () => {
    const today = new Date();
    return complaints.filter(c => {
      const d = new Date(c.date);
      if (!(c.name + c.room + c.type).toLowerCase().includes(search.toLowerCase()))
        return false;
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
      stat[c.status]++;
      m[new Date(c.date).getMonth()]++;
    });
    setStats(stat);
    setMonths(m);
  }, [complaints]);

  /* CHART */
  useEffect(() => {
    const bar = new Chart(document.getElementById("barChart"), {
      type: "bar",
      data: {
        labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
        datasets: [{ label: "Complaints", data: months }]
      }
    });

    const pie = new Chart(document.getElementById("pieChart"), {
      type: "pie",
      data: {
        labels: Object.keys(stats),
        datasets: [{ data: Object.values(stats) }]
      }
    });

    return () => {
      bar.destroy();
      pie.destroy();
    };
  }, [months, stats]);

  /* ACTIONS */
  const assign = (i) => {
    if (!staff) return alert("Select staff");
    const updated = [...complaints];
    updated[i].status = "Assigned";
    updated[i].staff = staff;
    updateStorage(updated);
  };

  const solve = (i) => {
    const updated = [...complaints];
    updated[i].status = "Solved";
    updateStorage(updated);
  };

  const del = (i) => {
    const updated = complaints.filter((_, index) => index !== i);
    updateStorage(updated);
  };

  return (
    <div className="complaint-container">
      <h2>Complaint Management</h2>

      {/* FILTER SECTION */}
      <div className="top">
        <input
          type="text"
          placeholder="Search..."
          onChange={(e) => setSearch(e.target.value)}
        />

        <select onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>

        <select onChange={(e) => setStaff(e.target.value)}>
          <option value="">Assign Staff</option>
          <option>Cleaning</option>
          <option>Electrician</option>
          <option>Plumber</option>
        </select>
      </div>

      {/* STAT CARDS */}
      <div className="cards">
        <div className="card">Total <h2>{complaints.length}</h2></div>
        <div className="card">Pending <h2>{stats.Pending}</h2></div>
        <div className="card">Assigned <h2>{stats.Assigned}</h2></div>
        <div className="card">Solved <h2>{stats.Solved}</h2></div>
      </div>

      {/* COMPLAINTS TABLE */}
      <table className="complaint-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Room</th>
            <th>Type</th>
            <th>Msg</th>
            <th>Image</th>
            <th>Status</th>
            <th>Staff</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((c, i) => (
            <tr key={i}>
              <td>{c.name}</td>
              <td>{c.room}</td>
              <td>{c.type}</td>
              <td>{c.msg}</td>
              <td><img src={c.img} alt="issue" style={{width: '50px', borderRadius: '4px'}} /></td>
              <td>
                <span className={`status ${c.status.toLowerCase()}`}>
                  {c.status}
                </span>
              </td>
              <td>{c.staff || "-"}</td>
              <td>
                <div className="action-btns">
                    <button className="assign" onClick={() => assign(i)}>Assign</button>
                    <button className="solve" onClick={() => solve(i)}>Solve</button>
                    <button className="delete" onClick={() => del(i)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ANALYTICS CHARTS */}
      <div className="chart-section">
        <div className="chart-box">
          <h3>Monthly Trend</h3>
          <canvas id="barChart"></canvas>
        </div>
        <div className="chart-box">
          <h3>Status Breakdown</h3>
          <canvas id="pieChart"></canvas>
        </div>
      </div>
    </div>
  );
};

export default AdminComplain;