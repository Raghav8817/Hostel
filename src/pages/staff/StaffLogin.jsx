import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../../styles/AuthShared.css';

const StaffLogin = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
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

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            const form = e.currentTarget;
            const focusable = Array.from(form.querySelectorAll('input, select, button[type="submit"]'));
            const index = focusable.indexOf(e.target);
            if (index > -1 && index < focusable.length - 1) {
                e.preventDefault();
                focusable[index + 1].focus();
            }
        }
    };

    return (
        <div className="login-page-body">
            <div className="bg-overlay"></div>
            <div className="login-container">
                <div className="form-box">
                    <h2>Staff Login</h2>
                    {error && <p className="login-error">{error}</p>}
                    <form onSubmit={handleLogin} onKeyDown={handleKeyDown}>
                        <div className="input-group">
                            <i className="fas fa-user"></i>
                            <input 
                                type="text" 
                                placeholder="Username" 
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required 
                            />
                        </div>

                        <div className="input-group">
                            <i className="fas fa-lock"></i>
                            <input 
                                type="password" 
                                placeholder="Password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required 
                            />
                        </div>

                        <button type="submit" className="login-btn">
                            Sign In
                        </button>
                    </form>

                    <div className="switch">
                        <Link to="/register/staff">Create Account</Link> | 
                        <Link to="/forgot">Forgot Password</Link>
                    </div>

                    <div className="switch">
                        <Link to="/" style={{ fontSize: '0.8rem', opacity: 0.7 }}>← Back to Home</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StaffLogin;
