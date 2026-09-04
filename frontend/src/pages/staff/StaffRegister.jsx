import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import "../../styles/RegisterShared.css";
import { BASE_URL } from "../../config/api";

function StaffRegistration() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        firstname: "",
        middlename: "",
        lastname: "",
        gender: "",
        work_type: "",
        email: "",
        phone: "",
        password: "",
        confirmpassword: "",
        profile_pic: ""
    });

    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, profile_pic: reader.result }));
            };
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const nameRegex = /^[A-Z][a-z\s]+$/; 
        if (!nameRegex.test(formData.firstname) || !nameRegex.test(formData.lastname)) {
            setErrorMessage("Names must start with a capital letter.");
            return;
        }

        const phoneRegex = /^[6-9]\d{9}$/; 
        if (!phoneRegex.test(formData.phone)) {
            setErrorMessage("Phone number must be 10 digits and start with 6-9.");
            return;
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(formData.password)) {
            setErrorMessage("Password: 8+ chars, uppercase, lowercase, number, special character.");
            return;
        }

        if (formData.password !== formData.confirmpassword) {
            setErrorMessage("Passwords do not match!");
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/register/staff`, { 
                method: 'POST', 
                headers: { 
                    'Content-Type': 'application/json' 
                }, 
                credentials: 'include',
                body: JSON.stringify(formData) 
            });
            const data = await response.json();
            
            if (!response.ok) {
                setErrorMessage(data.error || "Failed to register.");
                return;
            }

            setErrorMessage("");
            navigate('/login/staff');
            
        } catch (error) {
            setErrorMessage("Error connecting to the server.");
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            const form = e.currentTarget;
            const focusable = Array.from(form.querySelectorAll('input:not([type="file"]), select'));
            const index = focusable.indexOf(e.target);
            
            if (index > -1 && index < focusable.length - 1) {
                e.preventDefault();
                focusable[index + 1].focus();
            }
        }
    };

    return (
        <div className="register-page-body">
            <div className="bg-overlay"></div>
            <div className="register-container">
                <div className="form-box">
                    <h2>Staff Registration</h2>

                    <form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
                        <div className="form-grid">
                            <div className="input-group">
                                <i className="fas fa-user"></i>
                                <input type="text" placeholder="Username" name="username" value={formData.username} onChange={handleChange} required />
                            </div>

                            <div className="input-group">
                                <i className="fas fa-user-tag"></i>
                                <input type="text" placeholder="First Name" name="firstname" value={formData.firstname} onChange={handleChange} required />
                            </div>
                            
                            <div className="input-group">
                                <i className="fas fa-user-tag"></i>
                                <input type="text" placeholder="Middle Name (Opt)" name="middlename" value={formData.middlename} onChange={handleChange} />
                            </div>

                            <div className="input-group">
                                <i className="fas fa-user-tag"></i>
                                <input type="text" placeholder="Last Name" name="lastname" value={formData.lastname} onChange={handleChange} required />
                            </div>

                            <div className="input-group">
                                <i className="fas fa-venus-mars"></i>
                                <select name="gender" value={formData.gender} onChange={handleChange} required>
                                    <option value="" disabled>Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div className="input-group">
                                <i className="fas fa-tools"></i>
                                <select name="work_type" value={formData.work_type} onChange={handleChange} required>
                                    <option value="" disabled>Select Work Type</option>
                                    <option value="Electricity">Electricity</option>
                                    <option value="Water">Water</option>
                                    <option value="Internet">Internet</option>
                                    <option value="Cleaning">Cleaning</option>
                                    <option value="Food">Food</option>
                                    <option value="Security">Security</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div className="input-group">
                                <i className="fas fa-envelope"></i>
                                <input type="email" placeholder="Email Address" name="email" value={formData.email} onChange={handleChange} required />
                            </div>

                            <div className="input-group">
                                <i className="fas fa-phone"></i>
                                <input type="tel" placeholder="Phone Number" name="phone" value={formData.phone} maxLength="10" onChange={handleChange} required />
                            </div>

                            <div className="input-group">
                                <i className="fas fa-lock"></i>
                                <input type="password" placeholder="Password" name="password" value={formData.password} onChange={handleChange} required />
                            </div>

                            <div className="input-group">
                                <i className="fas fa-lock"></i>
                                <input type="password" placeholder="Confirm Password" name="confirmpassword" value={formData.confirmpassword} onChange={handleChange} required />
                            </div>

                            <div className="input-group" style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '10px 15px', gap: '8px', border: '1px dashed var(--border-color)', background: 'rgba(255, 255, 255, 0.02)' }}>
                                <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "8px" }}>
                                    <i className="fas fa-image"></i> Profile Picture (Optional)
                                </label>
                                <input type="file" accept="image/*" onChange={handleImageChange} style={{ width: "100%", padding: "5px", background: "transparent", border: "none", color: "var(--text-primary)", fontSize: "0.8rem", cursor: "pointer" }} />
                            </div>
                        </div>

                        {errorMessage && <div className="error-banner">{errorMessage}</div>}
                        {successMessage && <div className="success-banner">{successMessage}</div>}

                        <button type="submit" className="register-btn">
                            Register Now
                        </button>

                        <div className="switch">
                            Already registered? <Link to="/login/staff">Login</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default StaffRegistration;
