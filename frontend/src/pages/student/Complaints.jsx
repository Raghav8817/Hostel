import React, { useState, useEffect } from 'react';
import '../../styles/Complaints.css';

const Complaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({
        description: '',
        category: 'Electricity',
        room_number: '',
        photo: null
    });

    const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

    // Load data from the GET /complaints route
    const fetchComplaints = async () => {
        try {
            const response = await fetch(`${BASE_URL}/complaints`, { credentials: 'include' });
            const data = await response.json();
            if (response.ok) setComplaints(data);
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComplaints();
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setForm({ ...form, photo: reader.result });
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.description.trim() || !form.room_number.trim()) return alert("Fill all fields");

        try {
            const response = await fetch(`${BASE_URL}/complaints`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
                credentials: 'include'
            });

            if (response.ok) {
                setForm({ description: '', category: 'Electricity', room_number: '', photo: null });
                fetchComplaints(); // Refresh table immediately
                alert("Complaint filed!");
            }
        } catch (error) {
            console.error("Submit error:", error);
        }
    };

    const total = complaints.length;
    const pending = complaints.filter(c => c.status === "Pending").length;
    const resolved = complaints.filter(c => c.status === "Resolved").length;

    if (loading) return <div className="complaints-container">Loading...</div>;

    return (
        <div className="complaints-container">
            <div className="complaint-cards">
                <div className="c-card blue-gradient"><span>Total</span><h2>{total}</h2></div>
                <div className="c-card orange-gradient"><span>Pending</span><h2>{pending}</h2></div>
                <div className="c-card green-gradient"><span>Resolved</span><h2>{resolved}</h2></div>
            </div>

            <div className="complaint-content">
                <div className="complaint-form-box">
                    <h3>Submit New Complaint</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Room No.</label>
                            <input type="text" value={form.room_number} onChange={(e) => setForm({ ...form, room_number: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label>Category</label>
                            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                                <option>Electricity</option><option>Water</option><option>Internet</option><option>Cleaning</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label>Photo</label>
                            <input type="file" onChange={handleFileChange} />
                        </div>
                        <button type="submit" className="submit-btn">Submit</button>
                    </form>
                </div>

                <div className="complaint-table-box">
                    <h3>History</h3>
                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>Description</th>
                                    <th>Category</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {complaints.map(c => (
                                    <tr key={c.id}>
                                        <td>{c.description.substring(0, 25)}...</td>
                                        <td>{c.category}</td>
                                        <td><span className={`status-pill ${c.status.toLowerCase()}`}>{c.status}</span></td>
                                        <td>{new Date(c.created_at).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Complaints;