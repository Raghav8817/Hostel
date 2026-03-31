import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Forgot.css';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [input, setInput] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!input) {
            setError('Please enter email or phone');
            return;
        }

        try {
            const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

            const res = await fetch(`${BASE_URL}/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ input })
            });

            if (res.ok) {
                setMessage('Reset link sent successfully!');
            } else {
                const data = await res.json();
                setError(data.error || 'Something went wrong');
            }
        } catch {
            setError('Server error');
        }
    };

    return (
        <>
            <div className="bg-overlay"></div>

            <div className="forgot-container">
                <div className="form-box">
                    <h2>Forgot Password</h2>

                    <p className="subtitle">
                        Enter your email or phone number to reset your password.
                    </p>

                    {error && <p className="error">{error}</p>}
                    {message && <p className="success">{message}</p>}

                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <i className="fas fa-envelope"></i>
                            <input
                                type="text"
                                placeholder="Email or Phone Number"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="forgot-btn">
                            Send Reset Link
                        </button>

                        <div className="switch">
                            <span onClick={() => navigate('/login')}>
                                ← Back to Login
                            </span>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default ForgotPassword;
