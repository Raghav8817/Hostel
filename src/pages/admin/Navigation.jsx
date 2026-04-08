import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../../styles/admin/Navigation.css'

const Navigation = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState("Admin");
  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  useEffect(() => {
    // Attempt to load name from localStorage if you're still using it for UI
    const saved = JSON.parse(localStorage.getItem("adminProfile"));
    if (saved && saved.firstname) {
      setAdminName(saved.firstname);
    }
  }, []);

  const handleLogout = async () => {
    try {
      // 1. Call backend to clear the JWT/Session cookie
      const response = await fetch(`${BASE_URL}/logout`, {
        method: "POST",
        credentials: "include", // Essential to send/clear cookies
      });

      if (response.ok) {
        // 2. Clear any local storage data
        localStorage.removeItem("adminProfile");

        // 3. Redirect to the login selector or admin login
        // Using "/" is often safer if your ProtectedRoute redirects there
        navigate("/login");
      } else {
        console.error("Logout failed on server");
      }
    } catch (err) {
      console.error("Logout error:", err);
      // Fallback: move to login anyway
      navigate("/login");
    }
  };

  return (
    <header className="topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <button className="hamburger-btn" onClick={onMenuClick}>☰</button>
        <h2 style={{ color: "var(--text-primary)" }}>Admin Panel</h2>
      </div>
      <div className="header-actions">
        {/* <span style={{ color: "var(--text-primary)", marginRight: "15px", display: 'flex', alignItems: 'center' }}>Welcome, {adminName}</span> */}
        <button className="btn">Notifications</button>
        <button className="btn logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navigation;