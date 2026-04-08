import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import '../../styles/Profile.css';

const Profile = () => {
    const user = useOutletContext();
    const navigate = useNavigate();

    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark-mode');

    useEffect(() => {
        document.body.className = theme;
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === 'dark-mode' ? 'light-mode' : 'dark-mode');
    };

    if (!user) {
        return (
            <div className="loading-container" style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                color: '#00c6ff'
            }}>
                <h2>Loading User Data...</h2>
            </div>
        );
    }

    return (
        <div className="profile-container">
            {/* PROFILE CARD */}
            <div className="profile-card">
                {/* UPDATED: Logic to show uploaded pic or a default UI avatar */}
                <img
                    src={user.profile_pic || `https://ui-avatars.com/api/?name=${user.firstname}+${user.lastname}&background=00c6ff&color=fff`}
                    alt="Profile"
                    className="profile-avatar"
                />

                <div className="profile-info">
                    <h2>{user.firstname} {user.lastname}</h2>
                    <p><strong>Username:</strong> {user.username}</p>
                    <p><strong>Role:</strong> {user.role || 'Student'}</p>

                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <div className="theme-switch-wrapper">
                            <span style={{color: 'var(--text-primary)', fontWeight: 'bold'}}>{theme === 'light-mode' ? '☀️' : '🌙'}</span>
                            <label className="theme-switch" htmlFor="student-checkbox">
                                <input type="checkbox" id="student-checkbox" checked={theme === 'dark-mode'} onChange={toggleTheme} />
                                <div className="slider round"></div>
                            </label>
                        </div>
                        <button className="btn edit-btn" onClick={() => navigate('/edit')}>
                            <i className="fas fa-edit"></i> Edit Profile
                        </button>
                    </div>
                </div>
            </div>

            {/* BIO SECTION (NEW) */}
            {user.bio && (
                <div className="bio-section">
                    <h3>About Me</h3>
                    <p>{user.bio}</p>
                </div>
            )}

            {/* DETAILS GRID */}
            <div className="info-grid">
                <div className="info-box">
                    <h4>Full Name</h4>
                    <p>{user.firstname} {user.lastname}</p>
                </div>

                <div className="info-box">
                    <h4>Email</h4>
                    <p>{user.email || `${user.username}@college.edu`}</p>
                </div>

                <div className="info-box">
                    <h4>Phone</h4>
                    <p>{user.phone || 'Not Provided'}</p>
                </div>

                <div className="info-box">
                    <h4>Course</h4>
                    <p>{user.course?user.course:""}</p>
                </div>
            </div>

            
        </div>
    );
};

export default Profile;