import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import '../../styles/Login.css';

const Login = () => {
    const navigate = useNavigate();
    const [identifier, setIdentifier] = useState(''); // For username, email, or phone
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        if (!identifier || !password) {
            setError('Please fill in all fields');
            return;
        }

        try {
            const response = await fetch(("http://localhost:3000" || import.meta.env.VITE_API_URL) + "/login/student", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ identifier, password })
                
            });

            // console.log(JSON.stringify({ identifier, password }))
            console.log(response.ok)
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
            <h2>Student Login</h2>
            {error && <p className="login-error">{error}</p>}
            <form onSubmit={handleLogin} className="login-form">
                <div className="login-input-group">
                    <label htmlFor="identifier">
                        Username, Email, or Phone
                    </label>
                    <input
                        type="text"
                        id="identifier"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
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
