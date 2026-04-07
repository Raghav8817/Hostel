import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Navigation = () => {
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState("Admin");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("adminProfile"));
    if (saved && saved.name) setAdminName(saved.name);
  }, []);

  return (
    <header className="topbar">
      <h2>Admin Panel</h2>
      <div className="header-actions">
        <button className="btn">Notifications</button>
        <button className="btn logout" onClick={() => navigate("/login/admin")}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navigation;