import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./AdminSidebar";
import Navigation from "./Navigation";
import "../../styles/admin/AdminLayout.css";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="admin-layout">
      {/* Top Navigation */}
      <Navigation onMenuClick={toggleSidebar} />

      <div className="admin-container">
        {/* Mobile Overlay */}
        {isSidebarOpen && (
          <div className="admin-overlay" onClick={toggleSidebar}></div>
        )}

        {/* Sidebar */}
        <div className={`admin-sidebar-wrapper ${isSidebarOpen ? 'open' : ''}`}>
          <Sidebar closeMobileMenu={() => setIsSidebarOpen(false)} />
        </div>

        {/* Main Content Area */}
        <main className="admin-main">
          {/* Dynamic Page Content */}
          <div className="admin-content-area">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;