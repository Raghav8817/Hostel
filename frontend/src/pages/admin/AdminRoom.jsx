import React, { useEffect, useState } from "react";
import "../../styles/admin/AdminRoom.css"; 
import { Chart } from "chart.js/auto";

const AdminRoom = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [roomTypeFilter, setRoomTypeFilter] = useState("All");
  const [roomAcFilter, setRoomAcFilter] = useState("All");

  const [rooms, setRooms] = useState([]);
  const [requests, setRequests] = useState([]);
  
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [stats, setStats] = useState({
    available: 0, occupied: 0, single: 0, double: 0, triple: 0, ac: 0, nac: 0
  });

  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const roomRes = await fetch(`${BASE_URL}/admin/rooms-advanced`, { credentials: 'include' });
      const roomData = await roomRes.json();
      setRooms(Array.isArray(roomData) ? roomData : []);

      const reqRes = await fetch(`${BASE_URL}/admin/room-requests`, { credentials: 'include' });
      const reqData = await reqRes.json();
      setRequests(Array.isArray(reqData) ? reqData : []);
    } catch (err) {
      console.error("Error fetching admin room data:", err);
    }
  };

  const handleRequestAction = async (id, username, room_number, action) => {
    try {
      const endpoint = action === 'approve' ? '/admin/approve-room' : '/admin/reject-room';
      const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, username, room_number }),
        credentials: 'include'
      });
      if (res.ok) {
        fetchData();
      } else {
        const errData = await res.json();
        alert(`Failed: ${errData.error || 'Unknown error'}`);
      }
    } catch (err) {
      alert("Error interacting with server.");
    }
  };

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
      if (r.type === "Single" || r.type === "Single AC") s++;
      if (r.type === "Double") d++;
      if (r.type === "Triple") tr++;
      if (r.type && r.type.toLowerCase().includes("ac")) acCount++; else nacCount++;
    });

    setFilteredRooms(data);
    setStats({ available: av, occupied: oc, single: s, double: d, triple: tr, ac: acCount, nac: nacCount });
  }, [search, filter, rooms]);

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

  // --- Grouping helpers (same logic as student profile) ---
  const getAcLabel = (type) => type && type.toLowerCase().includes("ac") ? "AC" : "Non-AC";
  const getBaseType = (type) => {
    if (!type) return "Other";
    const t = type.toLowerCase();
    if (t.includes("single")) return "Single";
    if (t.includes("double")) return "Double";
    if (t.includes("triple")) return "Triple";
    return type;
  };
  const typeOrder = { Single: 1, Double: 2, Triple: 3 };

  // Apply ALL filters at once so the grouped display is always in sync
  const displayRooms = rooms.filter(r => {
    // search
    const names = (r.students || []).map(st => st.name + '(' + st.gender + ')').join(', ');
    if (!((r.no + ' ' + names).toLowerCase().includes(search.toLowerCase()))) return false;
    // boys/girls
    const hasMale = (r.students || []).some(st => st.gender === 'Male');
    const hasFemale = (r.students || []).some(st => st.gender === 'Female');
    if (filter === 'boys' && !hasMale && (r.students || []).length > 0) return false;
    if (filter === 'girls' && !hasFemale && (r.students || []).length > 0) return false;
    // type + AC filters
    if (roomTypeFilter !== 'All' && getBaseType(r.type) !== roomTypeFilter) return false;
    if (roomAcFilter !== 'All' && getAcLabel(r.type) !== roomAcFilter) return false;
    return true;
  });

  const groupedRooms = displayRooms.reduce((acc, r) => {
    const ac = getAcLabel(r.type);
    const base = getBaseType(r.type);
    const key = `${ac} — ${base} Sharing`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(r);
    return acc;
  }, {});

  const sortedGroupKeys = Object.keys(groupedRooms).sort((a, b) => {
    const [acA, typeA] = a.split(" — ");
    const [acB, typeB] = b.split(" — ");
    if (acA !== acB) return acA === "AC" ? -1 : 1;
    return (typeOrder[typeA.replace(" Sharing", "")] || 9) - (typeOrder[typeB.replace(" Sharing", "")] || 9);
  });

  return (
    <div className="room-management-content">
      {/* HEADER */}
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
        <div className="card"><span>Available</span> <h2 style={{ color: '#22c55e' }}>{stats.available}</h2></div>
        <div className="card"><span>Occupied</span> <h2 style={{ color: '#ef4444' }}>{stats.occupied}</h2></div>
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

      {/* ── PENDING ROOM REQUESTS (moved above room list) ── */}
      <div className="requests-box" style={{ background: '#1e1e1e', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
        <h3 style={{ color: 'white', marginBottom: '15px' }}>
          <i className="fas fa-inbox" style={{ marginRight: '8px', color: '#00c6ff' }}></i>
          Pending Room Requests
          {requests.length > 0 && (
            <span style={{ marginLeft: '10px', background: '#ef4444', color: 'white', fontSize: '12px', fontWeight: 700, padding: '2px 8px', borderRadius: '20px' }}>
              {requests.length}
            </span>
          )}
        </h3>
        {requests.length === 0 ? (
          <p style={{ color: '#aaa' }}>No pending requests at this time.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="room-table" style={{ width: '100%', borderCollapse: 'collapse', color: 'white', minWidth: '560px' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid #444' }}>
                  <th style={{ padding: '10px' }}>Student</th>
                  <th style={{ padding: '10px' }}>Room</th>
                  <th style={{ padding: '10px' }}>Date</th>
                  <th style={{ padding: '10px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((r) => (
                  <tr key={r.id} style={{ borderBottom: '1px solid #333' }}>
                    <td style={{ padding: '10px' }}>
                      <span style={{ fontWeight: 600 }}>{r.firstname} {r.lastname}</span><br/>
                      <small style={{ color: '#aaa' }}>@{r.username} &bull; {r.gender} &bull; {r.course}</small>
                    </td>
                    <td style={{ padding: '10px', fontWeight: 700, color: '#00c6ff' }}>{r.room_number}</td>
                    <td style={{ padding: '10px', color: '#aaa', fontSize: '13px' }}>{new Date(r.created_at).toLocaleDateString()}</td>
                    <td style={{ padding: '10px', textAlign: 'right' }}>
                      <button
                        onClick={() => handleRequestAction(r.id, r.username, r.room_number, 'approve')}
                        style={{ background: '#22c55e', color: 'white', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', marginRight: '8px', fontWeight: 600 }}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleRequestAction(r.id, r.username, r.room_number, 'reject')}
                        style={{ background: '#ef4444', color: 'white', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── ALL ROOMS — grouped & sorted ── */}
      <div className="table-box" style={{ background: '#1e1e1e', padding: '20px', borderRadius: '10px' }}>
        {/* All Rooms header + filters */}
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '18px' }}>
          <h3 style={{ color: 'white', margin: 0, flex: 1, minWidth: '140px' }}>
            <i className="fas fa-door-closed" style={{ marginRight: '8px', color: '#4A90E2' }}></i>
            All Rooms
            <span style={{ marginLeft: '10px', fontSize: '13px', color: '#aaa', fontWeight: 400 }}>
              ({displayRooms.length} rooms)
            </span>
          </h3>
          {/* Sharing Type filter */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            <label style={{ fontSize: '10px', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Sharing Type</label>
            <select
              value={roomTypeFilter}
              onChange={e => setRoomTypeFilter(e.target.value)}
              style={{ padding: '7px 12px', borderRadius: '7px', background: '#2a2a2a', color: 'white', border: '1px solid #444', cursor: 'pointer', fontSize: '13px' }}
            >
              <option value="All">All Types</option>
              <option value="Single">Single</option>
              <option value="Double">Double</option>
              <option value="Triple">Triple</option>
            </select>
          </div>
          {/* AC filter */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            <label style={{ fontSize: '10px', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em' }}>AC / Non-AC</label>
            <select
              value={roomAcFilter}
              onChange={e => setRoomAcFilter(e.target.value)}
              style={{ padding: '7px 12px', borderRadius: '7px', background: '#2a2a2a', color: 'white', border: '1px solid #444', cursor: 'pointer', fontSize: '13px' }}
            >
              <option value="All">All</option>
              <option value="AC">AC</option>
              <option value="Non-AC">Non-AC</option>
            </select>
          </div>
          {/* Reset */}
          {(roomTypeFilter !== "All" || roomAcFilter !== "All") && (
            <button
              onClick={() => { setRoomTypeFilter("All"); setRoomAcFilter("All"); }}
              style={{ padding: '7px 12px', borderRadius: '7px', background: 'transparent', color: '#aaa', border: '1px solid #444', cursor: 'pointer', fontSize: '12px', alignSelf: 'flex-end' }}
            >
              ✕ Reset
            </button>
          )}
        </div>

        {sortedGroupKeys.length === 0 ? (
          <p style={{ color: '#aaa' }}>No rooms found.</p>
        ) : (
          sortedGroupKeys.map(groupKey => (
            <div key={groupKey} style={{ marginBottom: '24px' }}>
              {/* Group header */}
              <p style={{
                fontSize: '11px', fontWeight: 700, color: '#00c6ff',
                textTransform: 'uppercase', letterSpacing: '0.08em',
                marginBottom: '10px', paddingBottom: '6px',
                borderBottom: '1px solid #2a2a2a'
              }}>
                {groupKey}
              </p>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', color: 'white', minWidth: '500px' }}>
                  <thead>
                    <tr style={{ textAlign: 'left', borderBottom: '1px solid #444' }}>
                      <th style={{ padding: '8px 10px', fontSize: '12px', color: '#aaa', fontWeight: 600 }}>Room</th>
                      <th style={{ padding: '8px 10px', fontSize: '12px', color: '#aaa', fontWeight: 600 }}>Type</th>
                      <th style={{ padding: '8px 10px', fontSize: '12px', color: '#aaa', fontWeight: 600 }}>Occupancy</th>
                      <th style={{ padding: '8px 10px', fontSize: '12px', color: '#aaa', fontWeight: 600 }}>Students</th>
                      <th style={{ padding: '8px 10px', fontSize: '12px', color: '#aaa', fontWeight: 600 }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedRooms[groupKey].map((r, index) => {
                      const status = r.students.length >= r.cap ? "Occupied" : "Available";
                      const names = r.students.map(st => `${st.name} (${st.gender})`).join(", ");
                      return (
                        <tr key={index} style={{ borderBottom: '1px solid #2a2a2a' }}>
                          <td style={{ padding: '8px 10px', fontWeight: 700 }}>{r.no}</td>
                          <td style={{ padding: '8px 10px', color: '#ccc' }}>{r.type}</td>
                          <td style={{ padding: '8px 10px', color: '#ccc' }}>{r.students.length} / {r.cap}</td>
                          <td style={{ padding: '8px 10px', color: '#ccc', fontSize: '13px' }}>{names || <span style={{ color: '#555' }}>Empty</span>}</td>
                          <td style={{ padding: '8px 10px' }}>
                            <span className={`status-badge ${status.toLowerCase()}`}>{status}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminRoom;