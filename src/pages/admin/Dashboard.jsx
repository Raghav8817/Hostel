import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await fetch((import.meta.env.VITE_API_URL || "http://localhost:3000") + '/logout', { 
                method: 'POST',
                credentials: 'include' 
            });
            navigate('/login');
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>Dashboard</h1>
                <button className="btn-logout" onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt"></i> Logout
                </button>
            </div>
            
            <p className="dashboard-welcome">Welcome back, Administrator. Here's what's happening today.</p>
            
            <div className="stats-grid">
                <div className="stat-card">
                    <h2>Live Statistics</h2>
                    <ul className="stat-list">
                        <li className="stat-item">
                            <span>Active Users</span>
                            <span className="stat-value">124</span>
                        </li>
                        <li className="stat-item">
                            <span>Pending Requests</span>
                            <span className="stat-value">12</span>
                        </li>
                        <li className="stat-item">
                            <span>System Status</span>
                            <span className="stat-value status-online">Online</span>
                        </li>
                    </ul>
                </div>
                
                <div className="stat-card">
                    <h2>Recent Activity</h2>
                    <ul className="stat-list">
                        <li className="stat-item">
                            <span>Server Uptime</span>
                            <span className="stat-value">99.9%</span>
                        </li>
                        <li className="stat-item">
                            <span>New Registrations</span>
                            <span className="stat-value">8 Today</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
