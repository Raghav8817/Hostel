import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import PuppyAnimation from './PuppyAnimation';

const ProtectedRoute = ({ children }) => {
    const [auth, setAuth] = useState({
        isAuthorized: null,
        role: null
    });
    const location = useLocation();

    useEffect(() => {
        const verifyToken = async () => {
            try {
                const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
                const response = await fetch(`${BASE_URL}/verify`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include'
                });

                const data = await response.json();
                console.log("Auth Check:", data);

                if (data.authenticated) {
                    setAuth({
                        isAuthorized: true,
                        role: data.role // Ensure backend returns 'admins' or 'students'
                    });
                } else {
                    setAuth({ isAuthorized: false, role: null });
                }
            } catch (error) {
                console.error("Token verification failed:", error);
                setAuth({ isAuthorized: false, role: null });
            }
        };

        verifyToken();
    }, [location.pathname]); // Re-verify on navigation

    // 1. Show loading while checking auth
    if (auth.isAuthorized === null) {
        return <PuppyAnimation />;
    }

    // 2. If NOT logged in, send to the login selector
    if (!auth.isAuthorized) {
        return <Navigate to="/login" replace />;
    }

    // 3. ROLE-BASED ACCESS CONTROL
    const path = location.pathname;

    // Block Admins from Student routes (Redirect them to Admin Dashboard)
    if (auth.role === 'admins' && !path.startsWith('/admin')) {
        return <Navigate to="/admin/dashboard" replace />;
    }

    // Block Students from Admin routes (Redirect them to Student Home)
    if (auth.role === 'students' && path.startsWith('/admin')) {
        return <Navigate to="/" replace />;
    }

    // 4. Authorized: Render the requested page
    return children;
};

export default ProtectedRoute;