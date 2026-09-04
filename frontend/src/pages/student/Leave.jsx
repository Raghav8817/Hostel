import React, { useState, useEffect } from 'react';
import '../../styles/Leave.css';
import { useOutletContext } from 'react-router-dom';

function Leave() {
    const userData = useOutletContext();
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        room_number: '', from_date: '', to_date: '', destination: '', reason: ''
    });

    const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

    const fetchLeaves = async () => {
        try {
            const response = await fetch(`${BASE_URL}/leave`, { credentials: 'include' });
            const data = await response.json();
            if (response.ok) setLeaves(data);
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaves();
    }, []);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const getDays = (from, to) => {
        const f = new Date(from);
        const t = new Date(to);
        const diff = Math.ceil((t - f) / (1000 * 60 * 60 * 24)) + 1;
        return diff > 0 ? diff : 0;
    };

    const applyLeave = async (e) => {
        e.preventDefault();
        if (!formData.room_number || !formData.from_date || !formData.to_date) {
            return alert("Please fill in required fields");
        }

        try {
            const response = await fetch(`${BASE_URL}/leave`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
                credentials: 'include'
            });

            if (response.ok) {
                setFormData({ room_number: '', from_date: '', to_date: '', destination: '', reason: '' });
                fetchLeaves();
                alert("Leave Applied!");
            }
        } catch (error) {
            console.error("Submit error:", error);
        }
    };

    const stats = {
        total: leaves.length,
        pending: leaves.filter(l => l.status === "Pending").length,
        approved: leaves.filter(l => l.status === "Approved").length,
        rejected: leaves.filter(l => l.status === "Rejected").length
    };

    if (loading) return <div className="leave-page">Loading...</div>;

    return (
        <div className="leave-page">
            <header className="leave-header"><h2>Leave Panel</h2></header>
            <div className="leave-layout">
                <main className="leave-main">
                    <div className="leave-cards">
                        <div className="l-card blue">Total <h2>{stats.total}</h2></div>
                        <div className="l-card orange">Pending <h2>{stats.pending}</h2></div>
                        <div className="l-card green">Approved <h2>{stats.approved}</h2></div>
                        <div className="l-card red">Rejected <h2>{stats.rejected}</h2></div>
                    </div>

                    <div className="leave-form-box">
                        <h3>Apply Leave</h3>
                        <form className="leave-form-grid" onSubmit={applyLeave}>
                            <input type="text" value={userData ? `${userData.firstname} ${userData.lastname}` : "Loading..."} readOnly disabled />
                            <input type="text" id="room_number" placeholder="Room No." value={formData.room_number} onChange={handleInputChange} />
                            <input type="date" id="from_date" value={formData.from_date} onChange={handleInputChange} />
                            <input type="date" id="to_date" value={formData.to_date} onChange={handleInputChange} />
                            <input type="text" id="destination" placeholder="Destination" value={formData.destination} onChange={handleInputChange} />
                            <textarea id="reason" placeholder="Reason" value={formData.reason} onChange={handleInputChange}></textarea>
                            <button type="submit" className="l-btn submit-btn">Submit Application</button>
                        </form>
                    </div>

                    <div className="leave-table-box">
                        <table>
                            <thead>
                                <tr>
                                    <th>To</th>
                                    <th>From</th>
                                    <th>Days</th>
                                    <th>Status</th>
                                    <th>Date Applied</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leaves.map((l) => (
                                    <tr key={l.id}>
                                        <td>{l.destination}</td>
                                        <td>{new Date(l.from_date).toLocaleDateString()}</td>
                                        <td>{getDays(l.from_date, l.to_date)}</td>
                                        <td className={`status-${l.status.toLowerCase()}`}>{l.status}</td>
                                        <td>{new Date(l.created_at).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Leave;