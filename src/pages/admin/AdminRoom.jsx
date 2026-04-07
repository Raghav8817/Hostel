import React, { useEffect, useState } from "react";
import "../../styles/admin/AdminRoom.css"; 
import { Chart } from "chart.js/auto";

const AdminRoom = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const rooms = [
    { no: "101", type: "Single", ac: "AC", students: [{ name: "Rahul", gender: "Male" }], cap: 1 },
    { no: "102", type: "Double", ac: "Non-AC", students: [{ name: "Aman", gender: "Male" }], cap: 2 },
    { no: "201", type: "Double", ac: "AC", students: [{ name: "Rohit", gender: "Male" }, { name: "Vikas", gender: "Male" }], cap: 2 },
    { no: "301", type: "Triple", ac: "AC", students: [{ name: "Priya", gender: "Female" }], cap: 3 },
    { no: "302", type: "Triple", ac: "Non-AC", students: [{ name: "Pooja", gender: "Female" }], cap: 3 }
  ];

  const [filteredRooms, setFilteredRooms] = useState([]);
  const [stats, setStats] = useState({
    available: 0, occupied: 0, single: 0, double: 0, triple: 0, ac: 0, nac: 0
  });

  useEffect(() => {
    let av = 0, oc = 0, s = 0, d = 0, tr = 0, acCount = 0, nacCount = 0;

    const data = rooms.filter(r => {
      let names = r.students.map(st => st.name + "(" + st.gender + ")").join(", ");
      let text = (r.no + " " + names).toLowerCase();
      if (!text.includes(search.toLowerCase())) return false;
      
      let hasMale = r.students.some(st => st.gender === "Male");
      let hasFemale = r.students.some(st => st.gender === "Female");
      
      if (filter === "boys" && !hasMale && r.students.length > 0) return false;
      if (filter === "girls" && !hasFemale && r.students.length > 0) return false;
      return true;
    });

    data.forEach(r => {
      let status = r.students.length >= r.cap ? "Occupied" : "Available";
      if (status === "Available") av++; else oc++;
      if (r.type === "Single") s++;
      if (r.type === "Double") d++;
      if (r.type === "Triple") tr++;
      if (r.ac === "AC") acCount++; else nacCount++;
    });

    setFilteredRooms(data);
    setStats({ available: av, occupied: oc, single: s, double: d, triple: tr, ac: acCount, nac: nacCount });
  }, [search, filter]);

  useEffect(() => {
    const typeCtx = document.getElementById("typeChart");
    const acCtx = document.getElementById("acChart");

    const typeChart = new Chart(typeCtx, {
      type: "bar",
      data: {
        labels: ["Single", "Double", "Triple"],
        datasets: [{ 
          label: "Rooms", 
          data: [stats.single, stats.double, stats.triple], 
          backgroundColor: '#4A90E2' 
        }]
      },
      options: { responsive: true }
    });

    const acChart = new Chart(acCtx, {
      type: "pie",
      data: {
        labels: ["AC", "Non-AC"],
        datasets: [{ 
          data: [stats.ac, stats.nac], 
          backgroundColor: ['#FF6384', '#36A2EB'] 
        }]
      },
      options: { responsive: true }
    });

    return () => {
      typeChart.destroy();
      acChart.destroy();
    };
  }, [stats]);

  return (
    <div className="room-management-content">
      {/* HEADER SECTION */}
      <div className="content-header" style={{ marginBottom: '20px' }}>
        <h2 style={{ color: 'white' }}>Room Management</h2>
      </div>

      {/* SEARCH + FILTER */}
      <div className="top" style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search rooms or students..."
          className="search-input"
          style={{ flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select 
          className="filter-select" 
          style={{ padding: '10px', borderRadius: '5px' }}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Categories</option>
          <option value="boys">Boys Rooms</option>
          <option value="girls">Girls Rooms</option>
        </select>
      </div>

      {/* STAT CARDS */}
      <div className="cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '20px' }}>
        <div className="card"><span>Total Rooms</span> <h2>{rooms.length}</h2></div>
        <div className="card"><span>Available</span> <h2 style={{color: '#22c55e'}}>{stats.available}</h2></div>
        <div className="card"><span>Occupied</span> <h2 style={{color: '#ef4444'}}>{stats.occupied}</h2></div>
      </div>

      {/* CHARTS */}
      <div className="chart-section" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        <div className="chart-box" style={{ background: '#1e1e1e', padding: '15px', borderRadius: '10px' }}>
          <h3 style={{ color: 'white', marginBottom: '10px' }}>Room Type Distribution</h3>
          <canvas id="typeChart"></canvas>
        </div>
        <div className="chart-box" style={{ background: '#1e1e1e', padding: '15px', borderRadius: '10px' }}>
          <h3 style={{ color: 'white', marginBottom: '10px' }}>AC vs Non-AC</h3>
          <canvas id="acChart"></canvas>
        </div>
      </div>

      {/* TABLE */}
      <div className="table-box" style={{ background: '#1e1e1e', padding: '20px', borderRadius: '10px' }}>
        <table className="room-table" style={{ width: '100%', borderCollapse: 'collapse', color: 'white' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid #444' }}>
              <th style={{ padding: '10px' }}>Room</th>
              <th style={{ padding: '10px' }}>Type</th>
              <th style={{ padding: '10px' }}>AC</th>
              <th style={{ padding: '10px' }}>Students</th>
              <th style={{ padding: '10px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredRooms.map((r, index) => {
              let status = r.students.length >= r.cap ? "Occupied" : "Available";
              let names = r.students.map(st => st.name + "(" + st.gender + ")").join(", ");
              return (
                <tr key={index} style={{ borderBottom: '1px solid #333' }}>
                  <td style={{ padding: '10px' }}>{r.no}</td>
                  <td style={{ padding: '10px' }}>{r.type}</td>
                  <td style={{ padding: '10px' }}>{r.ac}</td>
                  <td style={{ padding: '10px' }}>{names || "Empty"}</td>
                  <td style={{ padding: '10px' }}>
                    <span className={`status-badge ${status.toLowerCase()}`}>
                      {status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminRoom;