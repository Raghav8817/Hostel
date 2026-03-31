import React, { useState, useRef, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import '../../styles/EditProfile.css';

const EditProfile = () => {
    const userData = useOutletContext();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        phone: '',
        bio: '',
        profilePhoto: null
    });

    const [isSaving, setIsSaving] = useState(false);

    // Sync initial data from Layout context
    useEffect(() => {
        if (userData) {
            setFormData({
                firstname: userData.firstname || '',
                lastname: userData.lastname || '',
                phone: userData.phone || '',
                bio: userData.bio || '',
                profilePhoto: userData.profile_pic || null
            });
        }
    }, [userData]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, profilePhoto: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
            const response = await fetch(`${BASE_URL}/edit`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData), // No need to manually add username here
                credentials: 'include' // CRITICAL: This sends the cookie to the backend
            });

            if (response.ok) {
                // This forces a refresh or state update so the Nav bar shows the new name
                window.location.reload();
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="settings-page">
            <div className="settings-container">
                {/* Left Sidebar Menu */}
                <aside className="settings-sidebar">
                    <div className="sidebar-header">
                        <h3>Settings</h3>
                    </div>
                    <nav className="settings-nav">
                        <button className="nav-item active">
                            <i className="fas fa-user"></i> My Profile
                        </button>
                        <button className="nav-item">
                            <i className="fas fa-lock"></i> Security
                        </button>
                        <button className="nav-item">
                            <i className="fas fa-bell"></i> Notifications
                        </button>
                    </nav>
                </aside>

                {/* Right Content Area */}
                <main className="settings-content">
                    <header className="content-header">
                        <div>
                            <h1>Profile Information</h1>
                            <p>Update your photo and personal details here.</p>
                        </div>
                        <div className="header-actions">
                            <button type="button" className="btn-secondary" onClick={() => navigate('/profile')}>
                                Cancel
                            </button>
                            <button type="submit" form="profile-form" className="btn-primary" disabled={isSaving}>
                                {isSaving ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </header>

                    <section className="profile-upload-zone">
                        <div className="avatar-wrapper">
                            <img
                                src={formData.profilePhoto || "https://ui-avatars.com/api/?name=User"}
                                alt="Avatar"
                            />
                            <button className="change-photo-btn" onClick={() => fileInputRef.current.click()}>
                                <i className="fas fa-camera"></i>
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handlePhotoChange}
                                hidden
                                accept="image/*"
                            />
                        </div>
                        <div className="upload-info">
                            <h4>Your Profile Picture</h4>
                            <p>PNG or JPG no larger than 5MB.</p>
                            <button className="text-btn" onClick={() => fileInputRef.current.click()}>
                                Upload new image
                            </button>
                        </div>
                    </section>

                    <form id="profile-form" onSubmit={handleSubmit} className="form-grid">
                        <div className="input-field">
                            <label>First Name</label>
                            <input
                                type="text"
                                name="firstname"
                                value={formData.firstname}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="input-field">
                            <label>Last Name</label>
                            <input
                                type="text"
                                name="lastname"
                                value={formData.lastname}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="input-field full-width">
                            <label>Phone Number</label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+91 00000 00000"
                            />
                        </div>
                        <div className="input-field full-width">
                            <label>Bio</label>
                            <textarea
                                name="bio"
                                rows="4"
                                value={formData.bio}
                                onChange={handleChange}
                                placeholder="Write a short introduction..."
                            ></textarea>
                        </div>
                    </form>
                </main>
            </div>
        </div>
    );
};

export default EditProfile;