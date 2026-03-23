import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const [isAuthorized, setIsAuthorized] = React.useState(null);

    React.useEffect(() => {
        const verifyToken = async () => {
            try {
                // Securely ask the BACKEND if the token is valid! Let Chrome securely ferry the encrypted cookie dynamically!
                const response = await fetch((import.meta.env.VITE_API_URL || "http://localhost:3000") + '/verify-token', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include'
                });
                
                const data = await response.json();
                setIsAuthorized(data.valid === true);
            } catch (error) {
                console.error("Token verification failed:", error);
                setIsAuthorized(false);
            }
        };

        verifyToken();
    }, []);

    if (isAuthorized === null) {
        return <div>Verifying Session...</div>;
    }

    if (!isAuthorized) {
        return <Navigate to="/Login" replace />;
    }

    return children;
};

export default ProtectedRoute;
