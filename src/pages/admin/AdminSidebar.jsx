import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [profileImg, setProfileImg] = useState("https://i.pravatar.cc/150");
  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  useEffect(() => {
    const fetchSidebarImage = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/get-profile-pic`, {
          credentials: "include", // Essential for the verifyAdmin middleware to work
        });

        if (response.ok) {
          const data = await response.json();
          if (data.image) {
            setProfileImg(data.image);
          }
        }
      } catch (err) {
        console.error("Sidebar image fetch failed:", err);
      }
    };

    fetchSidebarImage();
  }, [location.pathname, BASE_URL]); // location.pathname added so it refreshes if you navigate back

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
        {/* Added some inline style to ensure the image looks consistent */}
        <img
          src={profileImg}
          alt="Admin"
          style={{ width: "60px", height: "60px", borderRadius: "50%", objectFit: "cover" }}
        />
        <h3>Hostel Admin</h3>
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