import React, { useState, useEffect } from "react";
import "../../styles/Notification.css";
export default function Notification() {
  const [notifications, setNotifications] = useState([
    { msg: "New Complaint Submitted", time: "2 min ago", read: false },
    { msg: "Fee Payment Pending", time: "10 min ago", read: false },
    { msg: "Attendance Updated", time: "1 hour ago", read: true }
  ]);

  const [showDropdown, setShowDropdown] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };
  const markRead = (index) => {
    const updated = [...notifications];
    updated[index].read = true;
    setNotifications(updated);
  };

  const markAllRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="container">

      {/* HEADER */}
      <header className="header">
        <h2>Notifications</h2>

        <div className="notification" onClick={toggleDropdown}>
          <i className="fas fa-bell"></i>
          <span className="badge">{unreadCount}</span>

          {showDropdown && (
            <div className="dropdown">
              {notifications.slice(0, 3).map((n, i) => (
                <div key={i}>{n.msg}</div>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* MAIN */}
      <main className="main">
        <div className="box">
          <h3>All Notifications</h3>

          {notifications.map((n, i) => (
            <div key={i} className={`item ${!n.read ? "unread" : ""}`}>
              <div>
                {n.msg}
                <br />
                <span>{n.time}</span>
              </div>

              <button onClick={() => markRead(i)}>✔</button>
            </div>
          ))}

          <button className="btn" onClick={markAllRead}>
            Mark All Read
          </button>

          <button className="btn" onClick={clearAll}>
            Clear All
          </button>
        </div>
      </main>
    </div>
  );
}