import React, { useState, useEffect } from 'react';
import StaffNavigation from './StaffNavigation';
import '../../styles/staff/StaffDashboard.css';

const StaffDashboard = () => {
    const [complaints, setComplaints] = useState([]);
    const [stats, setStats] = useState({ pending: 0, inProgress: 0, resolved: 0 });
    const [staffInfo, setStaffInfo] = useState({ workType: '', category: '' });
    const [loading, setLoading] = useState(true);
    const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

    const fetchData = async () => {
        try {
            const res = await fetch(`${BASE_URL}/staff/complaints`, { credentials: "include" });
            if (res.ok) {
                const data = await res.json();
                setComplaints(data.complaints);
                setStaffInfo({ workType: data.workType, category: data.mappedCategory });
                
                // Calculate Stats
                const statsMap = data.complaints.reduce((acc, curr) => {
                    const s = curr.status.toLowerCase().replace(/\s/g, '');
                    if (s === 'pending') acc.pending++;
                    else if (s === 'inprogress') acc.inProgress++;
                    else if (s === 'resolved') acc.resolved++;
                    return acc;
                }, { pending: 0, inProgress: 0, resolved: 0 });
                setStats(statsMap);
            }
        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [BASE_URL]);

    const updateStatus = async (id, newStatus) => {
        try {
            const res = await fetch(`${BASE_URL}/staff/complaints/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
                credentials: "include"
            });
            if (res.ok) {
                fetchData(); // Refresh
            }
        } catch (err) {
            console.error("Update error:", err);
        }
    };

    if (loading) return <div className="loading">Loading Dashboard...</div>;

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
            <StaffNavigation />
            <main className="staff-dashboard">
                <header className="staff-header">
                    <div>
                        <h1>Tast Board</h1>
                        <p style={{ color: 'var(--text-secondary)' }}>Welcome back! Here are the tasks assigned to your department.</p>
                    </div>
                    <div className="staff-badge">
                        {staffInfo.workType} Department
                    </div>
                </header>

                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon" style={{ color: '#ffc107' }}>⏳</div>
                        <div className="stat-info">
                            <h3>Pending Tasks</h3>
                            <div className="stat-value">{stats.pending}</div>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon" style={{ color: '#007bff' }}>⚙️</div>
                        <div className="stat-info">
                            <h3>In Progress</h3>
                            <div className="stat-value">{stats.inProgress}</div>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon" style={{ color: 'var(--success-color)' }}>✅</div>
                        <div className="stat-info">
                            <h3>Resolved Today</h3>
                            <div className="stat-value">{stats.resolved}</div>
                        </div>
                    </div>
                </div>

                <section className="task-section">
                    <h2>📋 Assigned Complaints ({staffInfo.category})</h2>
                    {complaints.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                            No complaints assigned to your department at the moment.
                        </div>
                    ) : (
                        <div className="complaint-list">
                            {complaints.map(item => (
                                <div key={item.id} className="complaint-item">
                                    <div className="complaint-details">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                            <h4>Complaint #{item.id}</h4>
                                            <span className={`status-badge status-${item.status.toLowerCase().replace(/\s/g, '-')}`}>
                                                {item.status}
                                            </span>
                                        </div>
                                        <p style={{ fontSize: '1.1rem', marginBottom: '10px' }}>{item.description}</p>
                                        <div className="complaint-meta">
                                            <span>🏠 Room: <strong>{item.room_number}</strong></span>
                                            <span>👤 Student: <strong>{item.username}</strong></span>
                                            <span>📅 Date: {new Date(item.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="action-btns">
                                        {item.status === 'Pending' && (
                                            <button 
                                                className="action-btn btn-progress"
                                                onClick={() => updateStatus(item.id, 'In Progress')}
                                            >
                                                Start Working
                                            </button>
                                        )}
                                        {item.status !== 'Resolved' && (
                                            <button 
                                                className="action-btn btn-resolve"
                                                onClick={() => updateStatus(item.id, 'Resolved')}
                                            >
                                                Mark Resolved
                                            </button>
                                        )}
                                        {item.status === 'Resolved' && (
                                            <span style={{ color: 'var(--success-color)', fontWeight: 'bold' }}>🏁 Completed</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
};

export default StaffDashboard;
