import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [profileImg, setProfileImg] = useState("https://i.pravatar.cc/150");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("adminProfile"));
    if (saved && saved.img) setProfileImg(saved.img);
  }, []);

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
        <img src={profileImg} alt="Admin" />
        <h3>Hostel Admin</h3>
      </div>
      <div className="sidebar-menu-items">
        {menuItems.map((item) => (
          <div
            key={item.path}
            className={`menu ${location.pathname === item.path ? "active" : ""}`}
            onClick={() => navigate(item.path)}
          >
            {item.icon} {item.name}
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;