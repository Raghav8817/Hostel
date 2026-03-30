import React, { useState } from 'react';
import '../../styles/Complaints.css';

const Complaints = () => {
    const [complaints, setComplaints] = useState([
        { id: 1, title: "Fan not working", type: "Electricity", status: "Pending", photo: null },
        { id: 2, title: "Water issue", type: "Water", status: "Resolved", photo: null }
    ]);

    const [form, setForm] = useState({ title: '', type: 'Electricity', photo: null });

    // Calculate Stats
    const total = complaints.length;
    const pending = complaints.filter(c => c.status === "Pending").length;
    const resolved = complaints.filter(c => c.status === "Resolved").length;

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setForm({ ...form, photo: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const addComplaint = () => {
        if (!form.title.trim()) return alert("Please enter a title");

        const newComplaint = {
            id: Date.now(),
            ...form,
            status: "Pending"
        };

        setComplaints([newComplaint, ...complaints]);
        setForm({ title: '', type: 'Electricity', photo: null }); // Reset form
    };

    const updateStatus = (id) => {
        setComplaints(complaints.map(c => {
            if (c.id === id) {
                if (c.status === "Pending") return { ...c, status: "In Progress" };
                if (c.status === "In Progress") return { ...c, status: "Resolved" };
            }
            return c;
        }));
    };

    const getStatusClass = (status) => {
        return status.toLowerCase().replace(" ", "-");
    };

    return (
        <div className="complaints-container">
            {/* STAT CARDS */}
            <div className="complaint-cards">
                <div className="c-card blue-gradient">
                    <span>Total</span>
                    <h2>{total}</h2>
                </div>
                <div className="c-card orange-gradient">
                    <span>Pending</span>
                    <h2>{pending}</h2>
                </div>
                <div className="c-card green-gradient">
                    <span>Resolved</span>
                    <h2>{resolved}</h2>
                </div>
            </div>

            <div className="complaint-content">
                {/* SUBMISSION FORM */}
                <div className="complaint-form-box">
                    <h3>Submit New Complaint</h3>
                    <div className="form-group">
                        <label>Complaint Title</label>
                        <input
                            type="text"
                            placeholder="Briefly describe the issue..."
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>Category</label>
                        <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                            <option>Electricity</option>
                            <option>Internet</option>
                            <option>Water</option>
                            <option>Room</option>
                            <option>Food</option>
                            <option>Other</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Attachment (Optional)</label>
                        <input type="file" accept="image/*" onChange={handleFileChange} />
                    </div>
                    <button className="submit-btn" onClick={addComplaint}>Submit Complaint</button>
                </div>

                {/* TABLE */}
                <div className="complaint-table-box">
                    <h3>Recent Complaints</h3>
                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Type</th>
                                    <th>Photo</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {complaints.map((c) => (
                                    <tr key={c.id}>
                                        <td>{c.title}</td>
                                        <td><span className="type-tag">{c.type}</span></td>
                                        <td>
                                            {c.photo ? <img src={c.photo} className="preview-img" alt="issue" /> : "None"}
                                        </td>
                                        <td>
                                            <span className={`status-pill ${getStatusClass(c.status)}`}>
                                                {c.status}
                                            </span>
                                        </td>
                                        <td>
                                            <button className="update-btn" onClick={() => updateStatus(c.id)}>
                                                Next Step
                                            </button>
                                        </td>
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