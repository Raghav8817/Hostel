import React, { useState, useEffect } from "react";
import "../../styles/admin/AdminProfile.css";

const AdminProfile = () => {
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
    
    // Optional: Reload to update the Sidebar image immediately
    window.location.reload();
  };

  /* IMAGE UPLOAD */
  const handleImage = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const updatedProfile = { ...profile, img: reader.result };
      setProfile(updatedProfile);
      // Save image immediately so sidebar can see it
      localStorage.setItem("adminProfile", JSON.stringify(updatedProfile));
    };

    if (file) reader.readAsDataURL(file);
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