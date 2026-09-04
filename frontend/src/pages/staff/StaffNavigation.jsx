import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../../styles/admin/Navigation.css'; // Reuse admin styles

const StaffNavigation = () => {
  const navigate = useNavigate();
  const [staffName, setStaffName] = useState("Staff");
  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark-mode');

  useEffect(() => {
    // Fetch profile to get name
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${BASE_URL}/staff/profile`, { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setStaffName(data.firstname || "Staff");
        }
      } catch (err) {
        console.error("Failed to fetch staff profile:", err);
      }
    };
    fetchProfile();
  }, [BASE_URL]);

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark-mode' ? 'light-mode' : 'dark-mode');
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(`${BASE_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        navigate("/login");
      }
    } catch (err) {
      console.error("Logout error:", err);
      navigate("/login");
    }
  };

  return (
    <header className="topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <h2 style={{ color: "var(--text-primary)" }}>Staff Panel</h2>
      </div>
      <div className="header-actions">
        <div className="theme-switch-wrapper" style={{ marginRight: '15px' }}>
          <span style={{color: 'var(--text-primary)', fontWeight: 'bold'}}>{theme === 'light-mode' ? '☀️' : '🌙'}</span>
          <label className="theme-switch" htmlFor="staff-nav-checkbox">
            <input type="checkbox" id="staff-nav-checkbox" checked={theme === 'dark-mode'} onChange={toggleTheme} />
            <div className="slider round"></div>
          </label>
        </div>
        <div style={{ color: 'var(--text-primary)', fontWeight: '600', marginRight: '15px' }}>
             Hi, {staffName}
        </div>
        <button className="btn logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default StaffNavigation;
