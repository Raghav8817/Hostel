import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/admin/AdminProfile.css";

const AdminProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: "Karan Kumar",
    email: "admin@gmail.com",
    phone: "9876543210",
    img: "https://i.pravatar.cc/150",
  });

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  /* LOAD FROM LOCALSTORAGE */
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("adminProfile"));
    if (saved) {
      setProfile(saved);
    }
  }, []);

  /* HANDLE INPUT */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  /* SAVE PROFILE */
  const saveProfile = () => {
    const updated = {
      name: formData.name || profile.name,
      email: formData.email || profile.email,
      phone: formData.phone || profile.phone,
      img: profile.img,
    };

    setProfile(updated);
    localStorage.setItem("adminProfile", JSON.stringify(updated));
    alert("Profile Saved!");
    setShowForm(false);
  };

  /* IMAGE UPLOAD */
  const handleImage = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      setProfile({ ...profile, img: reader.result });
    };

    if (file) reader.readAsDataURL(file);
  };

  return (
    <div className="dashboard-container">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <img src={profile.img} alt="top" />
          <h3>Admin Panel</h3>
        </div>
        <div className="sidebar-menu-items">
          <div className="menu" onClick={() => navigate("/AdminDashboard")}>🏠 Dashboard</div>
          <div className="menu active" onClick={() => navigate("/AdminProfile")}>👤 Profile</div>
          <div className="menu" onClick={() => navigate("/AdminStudents")}>👥 Students</div>
          <div className="menu">🛏 Rooms</div>
          <div className="menu">💰 Fees</div>
          <div className="menu">⚠ Complaints</div>
          <div className="menu">👨‍💼 Staff</div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="main">
        {/* TOPBAR */}
        <header className="topbar">
          <h2>Admin Profile</h2>
          <div className="header-actions">
            <button className="btn">Notifications</button>
            <button className="btn logout">Logout</button>
          </div>
        </header>

        <div className="profile-card">
          <div className="profile-top">
            <label>
              <img src={profile.img} alt="profile" />
              <input type="file" hidden onChange={handleImage} />
            </label>
            <h2>{profile.name}</h2>
            <p>Hostel Administrator</p>
          </div>

          <div className="profile-info">
            <div>Email: {profile.email}</div>
            <div>Phone: {profile.phone}</div>
            <div>Role: Admin</div>
            <div>Position: Hostel Warden</div>
          </div>

          <button
            className="btn edit-btn"
            onClick={() => setShowForm(!showForm)}
          >
            Edit Profile
          </button>

          {/* FORM */}
          {showForm && (
            <div className="edit-form">
              <input
                type="text"
                id="name"
                placeholder="Enter Name"
                onChange={handleChange}
              />
              <input
                type="email"
                id="email"
                placeholder="Enter Email"
                onChange={handleChange}
              />
              <input
                type="text"
                id="phone"
                placeholder="Enter Phone"
                onChange={handleChange}
              />
              <button className="btn" onClick={saveProfile}>
                Save
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminProfile;
