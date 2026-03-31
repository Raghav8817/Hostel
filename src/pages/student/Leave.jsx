import React, { useState, useEffect } from 'react';
import '../../styles/Leave.css';

function Leave (){
    // State for Leave Records
    const [leaves, setLeaves] = useState(() => {
        const saved = localStorage.getItem("leaves");
        return saved ? JSON.parse(saved) : [];
    });

    // State for Form Inputs
    const [formData, setFormData] = useState({
        name: '', room: '', from: '', to: '', type: 'Full Day', destination: '', reason: ''
    });

    // State for Search
    const [searchTerm, setSearchTerm] = useState('');

    // Sync with LocalStorage whenever leaves state changes
    useEffect(() => {
        localStorage.setItem("leaves", JSON.stringify(leaves));
    }, [leaves]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const getDays = (from, to) => {
        const f = new Date(from);
        const t = new Date(to);
        const diff = Math.ceil((t - f) / (1000 * 60 * 60 * 24)) + 1;
        return diff > 0 ? diff : 0;
    };

    const applyLeave = (e) => {
        e.preventDefault();
        const { name, room, from, to } = formData;

        if (!name || !room || !from || !to) {
            alert("Please fill in all required fields");
            return;
        }

        if (new Date(from) > new Date(to)) {
            alert("Invalid date range");
            return;
        }

        const newLeave = { ...formData, id: Date.now(), status: "Pending" };
        setLeaves([...leaves, newLeave]);

        // Reset Form
        setFormData({ name: '', room: '', from: '', to: '', type: 'Full Day', destination: '', reason: '' });
    };

    const updateStatus = (id, newStatus) => {
        setLeaves(leaves.map(l => l.id === id ? { ...l, status: newStatus } : l));
    };

    const deleteLeave = (id) => {
        if (window.confirm("Delete this leave record?")) {
            setLeaves(leaves.filter(l => l.id !== id));
        }
    };

    const filteredLeaves = leaves.filter(l =>
        l.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const stats = {
        total: leaves.length,
        pending: leaves.filter(l => l.status === "Pending").length,
        approved: leaves.filter(l => l.status === "Approved").length,
        rejected: leaves.filter(l => l.status === "Rejected").length
    };

    return (
        <div className="leave-page">
            <header className="leave-header">
                <h2>Leave Panel</h2>
            </header>

            <div className="leave-layout">
                <main className="leave-main">
                    {/* STATS CARDS */}
                    <div className="leave-cards">
                        <div className="l-card blue">Total <h2>{stats.total}</h2></div>
                        <div className="l-card orange">Pending <h2>{stats.pending}</h2></div>
                        <div className="l-card green">Approved <h2>{stats.approved}</h2></div>
                        <div className="l-card red">Rejected <h2>{stats.rejected}</h2></div>
                    </div>

                    {/* APPLY FORM */}
                    <div className="leave-form-box">
                        <h3>Apply Leave</h3>
                        <form className="leave-form-grid" onSubmit={applyLeave}>
                            <input type="text" id="name" placeholder="Name" value={formData.name} onChange={handleInputChange} />
                            <input type="text" id="room" placeholder="Room" value={formData.room} onChange={handleInputChange} />
                            <input type="date" id="from" value={formData.from} onChange={handleInputChange} />
                            <input type="date" id="to" value={formData.to} onChange={handleInputChange} />
                            <select id="type" value={formData.type} onChange={handleInputChange}>
                                <option>Full Day</option>
                                <option>Half Day</option>
                            </select>
                            <input type="text" id="destination" placeholder="Destination" value={formData.destination} onChange={handleInputChange} />
                            <textarea id="reason" placeholder="Reason" value={formData.reason} onChange={handleInputChange}></textarea>
                            <button type="submit" className="l-btn submit-btn">Submit Application</button>
                        </form>
                    </div>

                    {/* SEARCH */}
                    <div className="leave-search">
                        <input
                            type="text"
                            placeholder="Search by student name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* TABLE */}
                    <div className="leave-table-box">
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Room</th>
                                    <th>From</th>
                                    <th>To</th>
                                    <th>Days</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredLeaves.map((l) => (
                                    <tr key={l.id}>
                                        <td>{l.name}</td>
                                        <td>{l.room}</td>
                                        <td>{l.from}</td>
                                        <td>{l.to}</td>
                                        <td>{getDays(l.from, l.to)}</td>
                                        <td className={`status-${l.status.toLowerCase()}`}>{l.status}</td>
                                        <td>
                                            <button className="l-btn approve" onClick={() => updateStatus(l.id, 'Approved')}>✔</button>
                                            <button className="l-btn reject" onClick={() => updateStatus(l.id, 'Rejected')}>✖</button>
                                            <button className="l-btn delete" onClick={() => deleteLeave(l.id)}>🗑</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Leave;