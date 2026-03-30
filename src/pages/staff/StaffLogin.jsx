import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import '../../styles/Login.css';

const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState(''); // For username, email, or phone
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        if (!username || !password) {
            setError('Please fill in all fields');
            return;
        }

        try {
            const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

            const response = await fetch(`${BASE_URL}/login/staff`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ username, password })
            });

            if (response.ok) {
                navigate('/'); 
            } else {
                const data = await response.json();
                setError(data.error || 'Invalid credentials');
            }
        } catch (err) {
            setError('Error connecting to the server.');
        }
    };

    return (
        <div className="login-container">
            <h2>Staff Login</h2>
            {error && <p className="login-error">{error}</p>}
            <form onSubmit={handleLogin} className="login-form">
                <div className="login-input-group">
                    <label htmlFor="username">
                        Username, Email, or Phone
                    </label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your username, email or phone"
                        className="login-input"
                        required
                    />
                </div>
                <div className="login-input-group">
                    <label htmlFor="password">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="login-input"
                        required
                    />
                </div>
                <button type="submit" className="login-button">
                    Login
                </button>
            </form>
        </div>
    );
};

export default Login;
