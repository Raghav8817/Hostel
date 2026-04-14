import React, { useState, useEffect } from "react";
import "../../styles/admin/AdminStudents.css";
import { useNavigate } from "react-router-dom";

const AdminStudents = () => {
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  // 1. STATE DEFINITIONS
  const [students, setStudents] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Assignment Modal states
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [targetRoom, setTargetRoom] = useState("");
  const [assignStatus, setAssignStatus] = useState("");

  // 2. LOAD DATA
  const fetchData = async () => {
    try {
      setLoading(true);
      const [sRes, rRes] = await Promise.all([
        fetch(`${BASE_URL}/admin/students`, { credentials: "include" }),
        fetch(`${BASE_URL}/available-rooms`, { credentials: "include" })
      ]);
      
      if (sRes.ok) setStudents(await sRes.json());
      if (rRes.ok) setAvailableRooms(await rRes.json());
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 3. UPDATE STATUS (Approve/Reject)
  const updateStatus = async (username, newStatus) => {
    try {
      const response = await fetch(`${BASE_URL}/admin/students/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, status: newStatus }),
        credentials: "include",
      });

      if (response.ok) {
        setStudents(prev => prev.map(s => s.username === username ? { ...s, status: newStatus } : s));
      }
    } catch (err) {
      console.error("Status update error:", err);
    }
  };

  // 4. ASSIGN ROOM MANUALLY
  const handleAssignRoom = async () => {
    if (!targetRoom || !selectedStudent) return;
    setAssignStatus("Updating...");
    try {
      const res = await fetch(`${BASE_URL}/admin/assign-room`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: selectedStudent.username, room_number: targetRoom }),
        credentials: "include"
      });
      if (res.ok) {
        setAssignStatus("Success!");
        setTimeout(() => {
          setShowAssignModal(false);
          setAssignStatus("");
          fetchData(); // Refresh list
        }, 1000);
      } else {
        const data = await res.json();
        setAssignStatus(data.error || "Failed to assign.");
      }
    } catch (err) {
      setAssignStatus("Error.");
    }
  };

  // 5. DELETE STUDENT
  const deleteStudent = async (username) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    try {
      const response = await fetch(`${BASE_URL}/admin/students/${username}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        setStudents(prev => prev.filter(s => s.username !== username));
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  /* SEARCH FILTER & SORT */
  const filtered = students
    .filter((s) =>
      `${s.firstname || ""} ${s.lastname || ""} ${s.name || ""}`.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (a.status === "Pending" && b.status !== "Pending") return -1;
      if (a.status !== "Pending" && b.status === "Pending") return 1;
      return 0;
    });

  /* DYNAMIC COUNTS */
  const total = students.length;
  const male = students.filter(s => s.gender?.toLowerCase() === "male").length;
  const female = students.filter(s => s.gender?.toLowerCase() === "female").length;

  if (loading) return <div className="loading-container" style={{ padding: '20px', color: '#00c6ff' }}><h2>Loading Students...</h2></div>;

  return (
    <div className="student-management-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: 'var(--text-primary)' }}>Student Management</h2>
      </div>

      <div className="cards">
        <div className="card"><span>Total Students</span><h2>{total}</h2></div>
        <div className="card"><span>Male</span><h2 style={{ color: "#00c6ff" }}>{male}</h2></div>
        <div className="card"><span>Female</span><h2 style={{ color: "#ff4bb4" }}>{female}</h2></div>
      </div>

      <div className="table-actions">
        <input
          type="text"
          placeholder="Search student by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
          style={{ flex: 1 }}
        />
        {/* "+ Add New Student" button removed as per request */}
      </div>

      <div className="table-container table-responsive">
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
            {filtered.map((s) => (
              <tr key={s.username}>
                <td style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div className="avatar-initials small">
                    {(s.firstname || s.name || "U").charAt(0)}
                  </div>
                   <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 600 }}>{s.firstname ? `${s.firstname} ${s.lastname}` : s.name}</span>
                    <small style={{ color: '#888', fontSize: '11px' }}>@{s.username}</small>
                  </div>
                </td>
                <td style={{ fontWeight: s.room_number ? 700 : 400, color: s.room_number ? '#00c6ff' : 'inherit' }}>
                  {s.room_number || "N/A"}
                </td>
                <td style={{ textTransform: 'capitalize' }}>{s.gender}</td>
                <td><span className={`status ${(s.status || "").toLowerCase()}`}>{s.status}</span></td>
                <td className="action">
                  {/* EDIT BUTTON (Assign Room) */}
                  <button 
                    className="edit" 
                    title="Assign New Room"
                    onClick={() => {
                       setSelectedStudent(s);
                       setTargetRoom(s.room_number || "");
                       setShowAssignModal(true);
                    }}
                    style={{ background: 'rgba(0,198,255,0.1)', color: '#00c6ff', border: 'none', padding: '6px 10px', borderRadius: '5px', cursor: 'pointer', marginRight: '8px' }}
                  >
                    <i className="fas fa-edit"></i>
                  </button>

                  {s.status === "Pending" && (
                    <>
                      <button className="approve" onClick={() => updateStatus(s.username, "Approved")}>✔</button>
                      <button className="reject" onClick={() => updateStatus(s.username, "Rejected")}>✖</button>
                    </>
                  )}
                  <button className="delete" onClick={() => deleteStudent(s.username)}>🗑</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* NEW ASSIGN ROOM MODAL */}
      {showAssignModal && (
        <div className="modal">
          <div className="modal-box" style={{ maxWidth: '400px', padding: '30px' }}>
            <span className="close" onClick={() => setShowAssignModal(false)}>✖</span>
            <h3 style={{ marginBottom: '20px' }}>
               <i className="fas fa-door-open" style={{ marginRight: '10px', color: '#00c6ff' }}></i>
               Assign Room
            </h3>
            
            <p style={{ fontSize: '14px', color: '#aaa', marginBottom: '15px' }}>
              Select a room for <strong>{selectedStudent?.firstname} {selectedStudent?.lastname}</strong>
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#888', textTransform: 'uppercase' }}>Available Rooms</label>
              <select 
                value={targetRoom} 
                onChange={(e) => setTargetRoom(e.target.value)}
                style={{ padding: '12px', borderRadius: '8px', background: '#252528', color: 'white', border: '1px solid #444', outline: 'none' }}
              >
                <option value="">Move to N/A (Unassign)</option>
                {availableRooms.map(r => (
                  <option key={r.room_number} value={r.room_number}>
                     Room {r.room_number} — {r.room_type} ({r.capacity - r.current_occupancy} spots left)
                  </option>
                ))}
              </select>
            </div>

            {assignStatus && (
              <p style={{ 
                marginBottom: '15px', 
                fontSize: '13px', 
                fontWeight: 600, 
                color: assignStatus.includes("Success") ? "#22c55e" : "#ef4444",
                textAlign: 'center'
              }}>
                {assignStatus}
              </p>
            )}

            <button className="btn" onClick={handleAssignRoom} style={{ width: '100%', padding: '12px' }}>
              Apply Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStudents;