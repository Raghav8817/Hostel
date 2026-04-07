import React, { useEffect, useRef, useState } from "react";
import "../../styles/admin/AdminDashboard.css";
import { Chart } from "chart.js/auto";

const AdminDashboard = () => {
  const chartRef = useRef(null);
  const canvasRef = useRef(null);

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    room: "", 
    gender: "",
  });

  const saveStudent = () => {
    if (!form.name || !form.room || !form.gender) {
      alert("Please fill all fields!");
      return;
    }

    const saved = JSON.parse(localStorage.getItem("students")) || [
      { name: "Rahul Sharma", room: "101", gender: "Male", status: "Approved" },
      { name: "Aman Verma", room: "102", gender: "Male", status: "Pending" },
      { name: "Priya Sharma", room: "201", gender: "Female", status: "Approved" },
      { name: "Neha Gupta", room: "202", gender: "Female", status: "Pending" },
    ];

    const updated = [...saved, { ...form, status: "Pending" }];
    localStorage.setItem("students", JSON.stringify(updated));

    setForm({ name: "", room: "", gender: "" });
    setShowModal(false);
  };

  const data = {
    students: 150,
    rooms: 110,
    fees: 350000,
    complaints: 12,
    list: [
      { name: "Rahul", room: "101", fees: "Paid" },
      { name: "Aman", room: "102", fees: "Pending" },
      { name: "Priya", room: "103", fees: "Paid" },
      { name: "Neha", room: "104", fees: "Pending" },
      { name: "Karan", room: "105", fees: "Paid" },
    ],
  };

  useEffect(() => {
    const ctx = canvasRef.current;
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    chartRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Students", "Rooms", "Complaints"],
        datasets: [
          {
            label: "Hostel Data",
            data: [data.students, data.rooms, data.complaints],
            backgroundColor: ["#00c6ff", "#22c55e", "#ef4444"],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { labels: { color: "white" } },
        },
        scales: {
          x: { ticks: { color: "white" } },
          y: { ticks: { color: "white" } },
        },
      },
    });

    return () => {
      if (chartRef.current) chartRef.current.destroy();
    };
  }, []);

  return (
    <div className="admin-dashboard-content">
      {/* ACTION HEADER (Specific to Dashboard) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
         <h2 style={{ color: 'white' }}>Dashboard Overview</h2>
         <button className="btn" onClick={() => setShowModal(true)}>+ Add Student</button>
      </div>

      {/* CARDS */}
      <div className="cards">
        <div className="card">
          <span>Total Students</span>
          <h2>{data.students}</h2>
        </div>
        <div className="card">
          <span>Rooms Occupied</span>
          <h2>{data.rooms}</h2>
        </div>
        <div className="card">
          <span>Fees Collected</span>
          <h2>₹{data.fees}</h2>
        </div>
        <div className="card">
          <span>Complaints</span>
          <h2>{data.complaints}</h2>
        </div>
      </div>

      {/* GRID */}
      <div className="dashboard-grid">
        <div className="chart-box">
          <h3>Hostel Overview</h3>
          <canvas ref={canvasRef}></canvas>
        </div>

        <div className="table-box">
          <h3>Recent Student Records</h3>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Room</th>
                <th>Fees</th>
              </tr>
            </thead>
            <tbody>
              {data.list.map((s, index) => (
                <tr key={index}>
                  <td>{s.name}</td>
                  <td>{s.room}</td>
                  <td>
                    <span style={{ color: s.fees === "Paid" ? "#22c55e" : "#ef4444" }}>
                      {s.fees}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal">
          <div className="modal-box">
            <span className="close" onClick={() => setShowModal(false)}>✖</span>
            <h3>Add New Student</h3>
            <input
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              placeholder="Room"
              value={form.room}
              onChange={(e) => setForm({ ...form, room: e.target.value })}
            />
            <select
              value={form.gender}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
            >
              <option value="">Select Gender</option>
              <option>Male</option>
              <option>Female</option>
            </select>
            <button className="btn" onClick={saveStudent}>Save Student</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;