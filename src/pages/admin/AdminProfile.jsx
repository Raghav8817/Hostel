import React, { useState, useEffect } from "react";
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
    <div className="profile-card">
      <div className="profile-top">
        <label style={{ cursor: "pointer" }}>
          <img src={profile.img} alt="profile" />
          <input type="file" hidden onChange={handleImage} />
          <p style={{ fontSize: "12px", color: "#888" }}>Click image to change</p>
        </label>
        <h2>{profile.name}</h2>
        <p>Hostel Administrator</p>
      </div>

      <div className="profile-info">
        <div><strong>Email:</strong> {profile.email}</div>
        <div><strong>Phone:</strong> {profile.phone}</div>
        <div><strong>Role:</strong> Admin</div>
        <div><strong>Position:</strong> Hostel Warden</div>
      </div>

      <button
        className="btn edit-btn"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? "Cancel" : "Edit Profile"}
      </button>

      {/* FORM */}
      {showForm && (
        <div className="edit-form">
          <input
            type="text"
            id="name"
            placeholder="New Name"
            onChange={handleChange}
          />
          <input
            type="email"
            id="email"
            placeholder="New Email"
            onChange={handleChange}
          />
          <input
            type="text"
            id="phone"
            placeholder="New Phone"
            onChange={handleChange}
          />
          <button className="btn" onClick={saveProfile}>
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminProfile;