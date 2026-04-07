import React, { useEffect, useState } from "react";
import "./NotificationPanel.css";
import { Chart } from "chart.js/auto";
import { useNavigate } from "react-router-dom";
const NotificationPanel = () => {
  const navigate=useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const [modal, setModal] = useState(false);
  const [editIndex, setEditIndex] = useState(-1);

  const [toastMsg, setToastMsg] = useState("");

  const [form, setForm] = useState({
    title: "",
    msg: "",
    date: "",
    priority: "High"
  });

  /* LOAD DATA */
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("notifications")) || [
      { title: "Fee Reminder", msg: "Submit fees before 10th", date: "2026-04-10", priority: "High" },
      { title: "Water Maintenance", msg: "No water tomorrow", date: "2026-04-05", priority: "Medium" },
      { title: "Holiday Notice", msg: "Hostel closed Sunday", date: "2026-03-25", priority: "Low" }
    ];
    setNotifications(data);
  }, []);

  /* SAVE TO STORAGE */
  const updateStorage = (data) => {
    setNotifications(data);
    localStorage.setItem("notifications", JSON.stringify(data));
  };

  /* FILTER */
  const filtered = notifications.filter(n => {
    let status = new Date(n.date) >= new Date() ? "Active" : "Expired";

    if (statusFilter !== "all" && status !== statusFilter) return false;
    if (priorityFilter !== "all" && n.priority !== priorityFilter) return false;
    if (!(n.title + n.msg).toLowerCase().includes(search.toLowerCase())) return false;

    return true;
  });

  /* STATS */
  const active = notifications.filter(n => new Date(n.date) >= new Date()).length;
  const expired = notifications.length - active;

  /* CHART */
  useEffect(() => {
    let months = new Array(12).fill(0);

    notifications.forEach(n => {
      months[new Date(n.date).getMonth()]++;
    });

    const chart = new Chart(document.getElementById("chart"), {
      type: "bar",
      data: {
        labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
        datasets: [{ label: "Notifications", data: months }]
      }
    });

    return () => chart.destroy();

  }, [notifications]);

  /* SAVE */
  const save = () => {
    if (!form.title || !form.msg || !form.date) {
      alert("Fill all fields");
      return;
    }

    let updated;

    if (editIndex === -1) {
      updated = [...notifications, form];
      showToast("Added");
    } else {
      updated = [...notifications];
      updated[editIndex] = form;
      showToast("Updated");
    }

    updateStorage(updated);
    closeModal();
  };

  /* EDIT */
  const edit = (i) => {
    setEditIndex(i);
    setForm(notifications[i]);
    setModal(true);
  };

  /* DELETE */
  const del = (i) => {
    const updated = notifications.filter((_, index) => index !== i);
    updateStorage(updated);
    showToast("Deleted");
  };

  /* MODAL */
  const closeModal = () => {
    setModal(false);
    setForm({ title: "", msg: "", date: "", priority: "High" });
    setEditIndex(-1);
  };

  /* TOAST */
  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 2000);
  };

  return (
    <div className="layout">

      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="menu" onClick={() => navigate("/AdminDashboard")}>🏠 Dashboard</div>
        <div className="menu" onClick={() => navigate("/AdminProfile")}>👤 Profile</div>
        <div className="menu" onClick={() => navigate("/AdminStudents")}>👤 Students</div>
        <div className="menu" onClick={() => navigate("/Room")}>🛏 Rooms</div>
        <div className="menu" onClick={() => navigate("/Fees")}>💰 Fees</div>
        <div className="menu active">⚠ Complaints</div>
        <div className="menu" onClick={() => navigate("/Staff")}>👥 Staff</div>
      </aside>

      {/* MAIN */}
      <main className="main">

        <h2>Notification Management</h2>

        {/* CARDS */}
        <div className="cards">
          <div className="card">Total <h2>{notifications.length}</h2></div>
          <div className="card">Active <h2>{active}</h2></div>
          <div className="card">Expired <h2>{expired}</h2></div>
        </div>

        {/* FILTER */}
        <div className="top">
          <input placeholder="Search..." onChange={(e) => setSearch(e.target.value)} />

          <select onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Expired">Expired</option>
          </select>

          <select onChange={(e) => setPriorityFilter(e.target.value)}>
            <option value="all">All Priority</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <button className="add" onClick={() => setModal(true)}>+ Add</button>
        </div>

        {/* TABLE */}
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Message</th>
              <th>Date</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((n, i) => {
              let status = new Date(n.date) >= new Date() ? "Active" : "Expired";

              return (
                <tr key={i}>
                  <td>{n.title}</td>
                  <td>{n.msg}</td>
                  <td>{n.date}</td>
                  <td>
                    <span className={status === "Active" ? "activeStatus" : "expiredStatus"}>
                      {status}
                    </span>
                  </td>
                  <td>
                    <span className={n.priority.toLowerCase()}>
                      {n.priority}
                    </span>
                  </td>
                  <td>
                    <button className="edit" onClick={() => edit(i)}>Edit</button>
                    <button className="delete" onClick={() => del(i)}>Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* CHART */}
        <div className="chart">
          <canvas id="chart"></canvas>
        </div>

      </main>

      {/* MODAL */}
      {modal && (
        <div className="modal">
          <div className="modal-box">
            <h3>{editIndex === -1 ? "Add" : "Edit"} Notification</h3>

            <input
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />

            <textarea
              placeholder="Message"
              value={form.msg}
              onChange={(e) => setForm({ ...form, msg: e.target.value })}
            />

            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />

            <select
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
            >
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>

            <button onClick={save}>Save</button>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toastMsg && <div className="toast">{toastMsg}</div>}

    </div>
  );
};

export default NotificationPanel;
