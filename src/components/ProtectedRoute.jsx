import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const [isAuthorized, setIsAuthorized] = React.useState(null);

    React.useEffect(() => {
        const verifyToken = async () => {
            const tokenCookie = document.cookie.split('; ').find(row => row.startsWith('authToken='));
            if (!tokenCookie) {
                setIsAuthorized(false);
                return;
            }

            const token = tokenCookie.split('=')[1];

            try {
                // Securely ask the BACKEND if the token is valid! Don't use jwt.verify on the frontend.
                const response = await fetch('http://localhost:3000/verify-token', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ token })
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
