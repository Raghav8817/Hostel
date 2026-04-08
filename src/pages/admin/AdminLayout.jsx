import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./AdminSidebar";
import Navigation from "./Navigation";
import "../../styles/admin/AdminLayout.css";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="dashboard-container">
      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={toggleSidebar}></div>
      )}

      {/* Sidebar Wrapper */}
      <div className={`sidebar-wrapper ${isSidebarOpen ? 'open' : ''}`}>
        <Sidebar closeMobileMenu={() => setIsSidebarOpen(false)} />
      </div>

      {/* Main Content Area */}
      <main className="main">
        {/* Navigation (header) */}
        <Navigation onMenuClick={toggleSidebar} />

        {/* Dynamic Page Content */}
        <div className="content-area">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;