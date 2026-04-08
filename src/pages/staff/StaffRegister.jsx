import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import "../../styles/staff/staff_reg.css";

function StaffRegistration() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstname: "",
        middlename: "",
        lastname: "",
        gender: "",
        role: "",
        email: "",
        phone: "",
        password: "",
        confirmpassword: "",
    });
    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const nameRegex = /^[A-Za-z\s]+$/;
        if (!nameRegex.test(formData.firstname) || (formData.middlename && !nameRegex.test(formData.middlename)) || !nameRegex.test(formData.lastname)) {
            setErrorMessage("Names should only contain alphabets and spaces.");
            return;
        }

        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(formData.phone)) {
            setErrorMessage("Phone number must be exactly 10 digits.");
            return;
        }

        if (formData.password !== formData.confirmpassword) {
            setErrorMessage("Passwords do not match!");
            return;
        }

        try {
            const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
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
            console.error("error sending form data to backend", error);
        }
    };

    const showPasswordError = formData.confirmpassword && formData.password !== formData.confirmpassword;

    return (
        <div className="register-page-body">
            <div className="bg-overlay"></div>
            <div className="register-container">
                <div className="form-box">
                    <h2>Staff Registration</h2>

                    <form onSubmit={handleSubmit}>
                        {errorMessage && (
                            <div style={{ color: "red", backgroundColor: "#ffe6e6", padding: "10px", borderRadius: "5px", marginBottom: "15px", textAlign: "center" }}>
                                {errorMessage}
                            </div>
                        )}
                        <div className="form-grid">
                            <div className="input-group">
                                <i className="fas fa-user-tag"></i>
                                <input type="text" placeholder="First Name" name="firstname" value={formData.firstname} onChange={handleChange} required />
                            </div>
                            
                            <div className="input-group">
                                <i className="fas fa-user-tag"></i>
                                <input type="text" placeholder="Middle Name" name="middlename" value={formData.middlename} onChange={handleChange} />
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
                                <i className="fas fa-venus-mars"></i>
                                <select name="role" value={formData.role} onChange={handleChange} required>
                                    <option value="" disabled>Select Role</option>
                                    <option value="Mess">Mess</option>
                                    <option value="Electrician">Electrician</option>
                                    <option value="Security">Security</option>
                                    <option value="Cleaning">Cleaning</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div className="input-group full-width">
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
                            
                            <div className="input-group">
                                <i className="fas fa-image"></i>
                                <input type="file" name="photo" />
                            </div>
                        </div>

                        {showPasswordError && (
                            <div style={{ color: "red", fontSize: "12px", marginTop: "-10px", marginBottom: "15px", textAlign: "center" }}>
                                Passwords do not match!
                            </div>
                        )}

                        <button type="submit" className="register-btn">Register Now</button>

                        <p className="switch">
                            Already registered? <Link to="/login/staff">Login</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default StaffRegistration;
