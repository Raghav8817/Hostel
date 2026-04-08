import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/admin/AdminProfile.css";

const AdminProfile = () => {
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  // State matches your database columns
  const [profile, setProfile] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    gender: "",
    img: "https://i.pravatar.cc/150",
  });

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({});

  // 1. FETCH PROFILE DATA
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${BASE_URL}/admin-profile`, {
          credentials: "include" // Essential for sending the authToken cookie
        });

        if (response.ok) {
          const data = await response.json();
          setProfile((prev) => ({ ...prev, ...data }));
          setFormData(data);
        } else if (response.status === 401) {
          navigate("/login"); // Redirect if token expired
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };
    fetchProfile();
  }, [BASE_URL, navigate]);

  // Handle input changes in the edit form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // 2. SAVE UPDATED DATA TO DATABASE
  const saveProfile = async () => {
    try {
      const response = await fetch(`${BASE_URL}/update-admin-profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      if (response.ok) {
        setProfile({ ...profile, ...formData });
        alert("Success: Profile updated in the database!");
        setShowForm(false);
      } else {
        alert("Update failed. Please try again.");
      }
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  // 3. LOGOUT HANDLER
  const handleLogout = async () => {
    try {
      const res = await fetch(`${BASE_URL}/logout`, {
        method: "POST",
        credentials: "include"
      });
      if (res.ok) navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <img src={profile.img} alt="admin-head" />
          <h3>Admin Panel</h3>
        </div>
        <div className="sidebar-menu-items">
          <div className="menu" onClick={() => navigate("/AdminDashboard")}>🏠 Dashboard</div>
          <div className="menu active">👤 Profile</div>
          <div className="menu" onClick={() => navigate("/AdminStudents")}>👥 Students</div>
          <div className="menu">🛏 Rooms</div>
          <div className="menu">💰 Fees</div>
          <div className="menu">⚠ Complaints</div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <h2>Admin Profile</h2>
          <div className="header-actions">
            <button className="btn logout" onClick={handleLogout}>Logout</button>
          </div>
        </header>

        <div className="profile-card">
          <div className="profile-top">
            <img src={profile.img} alt="profile" />
            {/* Displaying name with safety fallback */}
            <h2>{profile.firstname || "Admin"} {profile.lastname || ""}</h2>
            <p>Hostel Warden & Administrator</p>
          </div>

          <div className="profile-info">
            <div><strong>Email:</strong> {profile.email || "No email set"}</div>
            <div><strong>Phone:</strong> {profile.phone || "No phone set"}</div>
            <div><strong>Gender:</strong> {profile.gender || "Not specified"}</div>
            <div><strong>Access Level:</strong> Full Admin</div>
          </div>

          <button className="btn edit-btn" onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancel Edit" : "Update Profile Info"}
          </button>

          {showForm && (
            <div className="edit-form">
              <div className="input-group">
                <label>First Name</label>
                <input type="text" id="firstname" defaultValue={profile.firstname} onChange={handleChange} />
              </div>
              <div className="input-group">
                <label>Last Name</label>
                <input type="text" id="lastname" defaultValue={profile.lastname} onChange={handleChange} />
              </div>
              <div className="input-group">
                <label>Email</label>
                <input type="email" id="email" defaultValue={profile.email} onChange={handleChange} />
              </div>
              <div className="input-group">
                <label>Phone</label>
                <input type="text" id="phone" defaultValue={profile.phone} onChange={handleChange} />
              </div>
              <button className="btn save-btn" onClick={saveProfile}>
                Confirm & Save to DB
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminProfile;