import React from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import '../../styles/Profile.css';

const Profile = () => {
    // This gets the user data passed from Layout's <Outlet context={userData} />
    const user = useOutletContext();
    const navigate = useNavigate();

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
                    <p><strong>Status:</strong> <span className="status-badge">Active</span></p>

                    <button className="btn edit-btn" onClick={() => navigate('/edit')}>
                        <i className="fas fa-edit"></i> Edit Profile
                    </button>
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
                    <h4>Department</h4>
                    <p>Computer Science</p>
                </div>
            </div>

            {/* STATS SECTION */}
            <div className="stats">
                <div className="stat">
                    <span>Attendance</span>
                    <h2>85%</h2>
                </div>

                <div className="stat">
                    <span>Fees Paid</span>
                    <h2>₹50,000</h2>
                </div>

                <div className="stat">
                    <span>Pending</span>
                    <h2>₹10,000</h2>
                </div>
            </div>
        </div>
    );
};

export default Profile;