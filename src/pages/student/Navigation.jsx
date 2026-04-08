import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../../styles/Navigation.css';

function Navigation({ user, onMenuClick }) {
    const navigate = useNavigate();

    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark-mode');

    useEffect(() => {
        document.body.className = theme;
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === 'dark-mode' ? 'light-mode' : 'dark-mode');
    };

    const handleLogout = async () => {
        try {
            const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
            const response = await fetch(`${BASE_URL}/logout`, {
                method: "POST",
                credentials: "include",
            });

            if (response.ok) {
                // Force a full page reload to the login page
                // This clears all React memory and forces ProtectedRoute to re-verify
                window.location.href = "/login";
            }
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };

    return (
        <header className="header">
            <div className="nav-left">
                {/* Hamburger Menu Button - Only visible on Mobile */}
                <button className="mobile-menu-btn" onClick={onMenuClick}>
                    <i className="fas fa-bars"></i>
                </button>

                
            </div>

            <div className="actions">
                <div className="theme-switch-wrapper" style={{ marginRight: '10px' }}>
                    <span style={{color: 'var(--text-primary)', fontWeight: 'bold'}}>{theme === 'light-mode' ? '☀️' : '🌙'}</span>
                    <label className="theme-switch" htmlFor="student-nav-checkbox">
                        <input type="checkbox" id="student-nav-checkbox" checked={theme === 'dark-mode'} onChange={toggleTheme} />
                        <div className="slider round"></div>
                    </label>
                </div>
                
                <button className="nav-icon-btn" onClick={() => navigate('/notifications')} title="Notifications">
                    <i className="fas fa-bell"></i>
                    <span className="badge-dot"></span>
                </button>

                {/* <button className="btn cyan hide-mobile" onClick={() => navigate('/leave')}>
                    Leave
                </button> */}

                <button className="btn red" onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt"></i> <span className="hide-mobile">Logout</span>
                </button>
            </div>
        </header>
    );
}

export default Navigation;