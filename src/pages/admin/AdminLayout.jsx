import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./AdminSidebar";
import Navigation from "./Navigation";
import "../../styles/admin/AdminProfile.css";

const AdminLayout = () => {
  return (
    <div className="dashboard-container">
      {/* Sidebar (aside) */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="main">
        {/* Navigation (header) */}
        <Navigation />

        {/* Dynamic Page Content */}
        <div className="content-area" style={{ padding: "20px" }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;