import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = ({ closeMobileMenu }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [profileImg, setProfileImg] = useState(null);
  const [adminName, setAdminName] = useState("Admin");
  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        // 1. Fetch Name
        const profileRes = await fetch(`${BASE_URL}/admin-profile`, { credentials: "include" });
        if (profileRes.ok) {
          const data = await profileRes.json();
          setAdminName(data.firstname || "Admin");
        }

        // 2. Fetch Image
        const imgRes = await fetch(`${BASE_URL}/api/get-profile-pic`, {
          credentials: "include",
        });

        if (imgRes.ok) {
          const data = await imgRes.json();
          if (data.image) {
            setProfileImg(data.image);
          }
        }
      } catch (err) {
        console.error("Sidebar data fetch failed:", err);
      }
    };

    fetchAdminData();
  }, [location.pathname, BASE_URL]);

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: "🏠" },
    { name: "Profile", path: "/admin/profile", icon: "👤" },
    { name: "Students", path: "/admin/students", icon: "👥" },
    { name: "Rooms", path: "/admin/room", icon: "🛏" },
    { name: "Fees", path: "/admin/fees", icon: "💰" },
    { name: "Complaints", path: "/admin/complaints", icon: "⚠" },
    { name: "Staff", path: "/admin/staff", icon: "👨‍💼" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div style={{ width: "60px", height: "60px", borderRadius: "50%", overflow: "hidden", cursor: "pointer" }} onClick={() => navigate('/admin/profile')}>
          {profileImg ? (
            <img
              src={profileImg}
              alt="Admin"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <div className="avatar-initials">
              {adminName.charAt(0)}
            </div>
          )}
        </div>
        <h3>{adminName}</h3>
      </div>
      <div className="sidebar-menu-items">
        {menuItems.map((item) => (
          <div
            key={item.path}
            className={`menu ${location.pathname === item.path ? "active" : ""}`}
            onClick={() => navigate(item.path)}
          >
            <span className="icon">{item.icon}</span> {item.name}
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;