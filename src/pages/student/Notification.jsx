import React, { useState, useEffect } from "react";
import "../../styles/Notification.css";

export default function Notification() {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(true);

  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  // 1. Fetch Notifications from DB
  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${BASE_URL}/notifications`, {
        credentials: 'include' // Important for cookies/JWT
      });
      const data = await response.json();
      if (response.ok) setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  // 2. Mark Single as Read in DB
  const markRead = async (id) => {
    try {
      await fetch(`${BASE_URL}/notifications/read/${id}`, {
        method: 'PUT',
        credentials: 'include'
      });
      // Update local state to avoid full refresh
      setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: 1 } : n));
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  // 3. Clear All (Delete from DB)
  const clearAll = async () => {
    if (!window.confirm("Are you sure you want to delete all notifications?")) return;
    try {
      await fetch(`${BASE_URL}/notifications/clear`, {
        method: 'DELETE',
        credentials: 'include'
      });
      setNotifications([]);
    } catch (error) {
      console.error("Clear failed:", error);
    }
  };

  // Helper to format MySQL timestamp to "2 min ago" style
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / 60000);
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    return date.toLocaleDateString();
  };

  if (loading) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      {/* HEADER */}
      <header className="header">
        <h2>Notifications</h2>
        <div className="notification" onClick={toggleDropdown} style={{ cursor: 'pointer', position: 'relative' }}>
          <i className="fas fa-bell"></i>
          {unreadCount > 0 && <span className="badge">{unreadCount}</span>}

          {showDropdown && (
            <div className="dropdown">
              {notifications.length === 0 ? (
                <div className="p-2">No new notifications</div>
              ) : (
                notifications.slice(0, 5).map((n) => (
                  <div key={n.id} className="dropdown-item">{n.message.substring(0, 30)}...</div>
                ))
              )}
            </div>
          )}
        </div>
      </header>

      {/* MAIN */}
      <main className="main">
        <div className="box">
          <h3>All Notifications</h3>

          {notifications.length === 0 ? (
            <p>You're all caught up!</p>
          ) : (
            notifications.map((n) => (
              <div key={n.id} className={`item ${!n.is_read ? "unread" : ""}`}>
                <div>
                  {n.message}
                  <br />
                  <span className="time-label">{formatTime(n.created_at)}</span>
                </div>
                {!n.is_read && (
                  <button onClick={() => markRead(n.id)} title="Mark as read">✔</button>
                )}
              </div>
            ))
          )}

          {notifications.length > 0 && (
            <button className="btn clear-btn" onClick={clearAll}>
              Clear All Notifications
            </button>
          )}
        </div>
      </main>
    </div>
  );
}