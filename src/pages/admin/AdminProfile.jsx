import React, { useState, useEffect } from "react";
import "../../styles/admin/AdminProfile.css";
import { useNavigate } from "react-router-dom";

const AdminProfile = () => {
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

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

  useEffect(() => {
    const loadData = async () => {
      try {
        // 1. Get Text Info
        const res = await fetch(`${BASE_URL}/admin-profile`, { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setProfile(prev => ({ ...prev, ...data }));
          setFormData(data);
        }

        // 2. Get Image Info
        const imgRes = await fetch(`${BASE_URL}/api/get-profile-pic`, { credentials: "include" });
        const imgData = await imgRes.json();
        if (imgData.image) {
          setProfile(prev => ({ ...prev, img: imgData.image }));
        }
      } catch (err) {
        console.error("Load error:", err);
      }
    };
    loadData();
  }, [BASE_URL]);

  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (file && file.size < 2000000) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64 = reader.result;
        setProfile(prev => ({ ...prev, img: base64 })); // Update UI

        await fetch(`${BASE_URL}/api/upload-profile-pic`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64 }),
          credentials: "include",
        });
      };
    } else {
      alert("Image too large (Max 2MB)");
    }
  };

  const handleLogout = async () => {
    try {
      // 1. Call the backend to clear the cookie
      await fetch(`${BASE_URL}/logout`, {
        method: 'POST',
        credentials: 'include'
      });

      // 2. Redirect to the main selector page
      // Your App.jsx uses "/" as the base for the LoginSelector logic
      navigate("/");

    } catch (err) {
      console.error("Logout error:", err);
      // Fallback redirect
      navigate("/");
    }
  };

  return (
    <div className="profile-card">
      <div className="profile-top">
        <label style={{ cursor: "pointer" }}>
          <img src={profile.img} alt="profile" style={{ width: "150px", height: "150px", borderRadius: "50%", objectFit: "cover" }} />
          <input type="file" hidden onChange={handleImage} accept="image/*" />
        </label>
        <h2 style={{ color: "white", marginTop: "15px" }}>{profile.firstname} {profile.lastname}</h2>
      </div>

      <div className="profile-info" style={{ color: "var(--text-primary)", margin: "20px 0" }}>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Phone:</strong> {profile.phone}</p>
        <p><strong>Gender:</strong> {profile.gender}</p>
      </div>

      <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
        <button className="btn edit-btn" onClick={() => setShowForm(true)} style={{ background: "var(--accent-color)", color: "var(--bg-primary)", border: "none", padding: "10px 20px", borderRadius: "8px", cursor: "pointer", fontWeight: "600", display: "flex", gap: "10px", alignItems: "center" }}>
            <i className="fas fa-edit"></i> Edit Profile
        </button>
        <button className="btn logout-btn" onClick={handleLogout} style={{ background: "var(--danger-color)", color: "white", border: "none", padding: "10px 20px", borderRadius: "8px", cursor: "pointer", fontWeight: "600", display: "flex", gap: "10px", alignItems: "center" }}>
          <i className="fas fa-sign-out-alt"></i> Logout
        </button>
      </div>

      {showForm && (
        <div className="modal" style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.5)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div className="modal-box" style={{ background: "var(--bg-secondary)", padding: "20px", borderRadius: "10px", width: "90%", maxWidth: "400px", color: "var(--text-primary)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
              <h3>Edit Profile</h3>
              <span className="close" onClick={() => setShowForm(false)} style={{ cursor: "pointer", fontSize: "20px" }}>✖</span>
            </div>
            <p style={{ color: "var(--text-secondary)", marginBottom: "20px" }}>
              Administrator details are managed securely via the database. To update your portrait, simply click on your avatar picture.
            </p>
            <button className="btn" onClick={() => setShowForm(false)} style={{ width: "100%" }}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProfile;