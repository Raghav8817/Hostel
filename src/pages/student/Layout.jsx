import React, { useState, useEffect } from 'react';
import '../../styles/Layout.css';
import Navigation from "./Navigation";
import Sidebar from "./Sidebar";
import { Outlet } from 'react-router-dom';

function Layout() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      
      try {
        const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
        const response = await fetch(`${BASE_URL}/user-data`, {
          credentials: 'include'
        });
        const data = await response.json();
        if (response.ok) {
          setUserData(data);
          console.log("data",data);
        }
      } catch (error) {
        console.error("Layout fetch error:", error);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="layout">
      <Navigation user={userData} />
      <div className="Sidebar-container"> {/* This class MUST have display: flex in CSS */}
        <Sidebar user={userData} />
        <main className="main">
          <Outlet context={userData} />
        </main>
      </div>
    </div>
  );
}

export default Layout;