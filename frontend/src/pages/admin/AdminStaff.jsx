import React, { useState, useEffect } from "react";
import "../../styles/admin/AdminStudents.css"; // Reusing the same styling for consistency
import { useNavigate } from "react-router-dom";

const AdminStaff = () => {
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const [staff, setStaff] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const fetchStaff = async () => {
    try {
      const response = await fetch(`${BASE_URL}/admin/staff`, { credentials: "include" });
      if (response.ok) {
        const data = await response.json();
        setStaff(data);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const deleteStaff = async (username) => {
    if (!window.confirm("Are you sure you want to remove this staff member?")) return;
    try {
      const response = await fetch(`${BASE_URL}/admin/staff/${username}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        setStaff(prev => prev.filter(s => s.username !== username));
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const filtered = staff.filter((s) => {
    const matchesSearch = `${s.firstname || ""} ${s.lastname || ""} ${s.username || ""}`.toLowerCase().includes(search.toLowerCase());
    const matchesWorkType = roleFilter === "all" || (s.work_type || "").toLowerCase() === roleFilter.toLowerCase();
    return matchesSearch && matchesWorkType;
  });

  // Hardcoded categories as per user request
  const roles = ["all", "Electricity", "Water", "Internet", "Cleaning", "Food", "Security"];

  const total = staff.length;
  const male = staff.filter(s => s.gender?.toLowerCase() === "male").length;
  const female = staff.filter(s => s.gender?.toLowerCase() === "female").length;

  if (loading) return <div style={{ color: 'var(--text-primary)', padding: '20px' }}>Loading Staff Members...</div>;

  return (
    <div className="student-management-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: 'var(--text-primary)' }}>Staff Management</h2>
      </div>

      <div className="cards">
        <div className="card"><span>Total Staff</span><h2>{total}</h2></div>
        <div className="card"><span>Male</span><h2 style={{ color: "#00c6ff" }}>{male}</h2></div>
        <div className="card"><span>Female</span><h2 style={{ color: "#ff4bb4" }}>{female}</h2></div>
      </div>

      <div className="table-actions">
        <input
          type="text"
          placeholder="Search staff by name or username..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <select 
          className="role-filter"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          style={{ padding: '10px', borderRadius: '8px', background: '#334155', color: 'white', border: '1px solid #475569', outline: 'none', cursor: 'pointer', marginLeft: '10px' }}
        >
          {roles.map(role => (
            <option key={role} value={role}>
              {role === "all" ? "All Types" : role}
            </option>
          ))}
        </select>
      </div>

      <div className="table-container table-responsive">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Username</th>
              <th>Work Type</th>
              <th>Role</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.username}>
                <td style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div className="avatar-initials small">
                    {(s.firstname || "S").charAt(0)}
                  </div>
                  {`${s.firstname || ""} ${s.lastname || ""}`}
                </td>
                <td>{s.username}</td>
                <td>{s.work_type || "N/A"}</td>
                <td>{s.role || "Staff"}</td>
                <td>{s.email}</td>
                <td>{s.phone || "N/A"}</td>
                <td className="action">
                  <button className="delete" onClick={() => deleteStaff(s.username)}>🗑</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminStaff;
