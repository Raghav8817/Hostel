import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import "../../styles/Register.css";

function StudentRegister() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        firstname: "",
        middlename: "",
        lastname: "",
        gender: "",
        email: "",
        phone: "",
        fathername: "",      // New Field
        fatherphone: "",     // New Field
        course: "",          // New Field
        password: "",
        confirmpassword: "",
        profile_pic: "",
    });

    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
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

        const nameRegex = /^[A-Za-z\s]+$/;
        if (!nameRegex.test(formData.firstname) || (formData.middlename && !nameRegex.test(formData.middlename)) || !nameRegex.test(formData.lastname)) {
            setErrorMessage("Names should only contain alphabets and spaces.");
            return;
        }

        if (!nameRegex.test(formData.fathername)) {
            setErrorMessage("Father's Name should only contain alphabets and spaces.");
            return;
        }

        const usernameRegex = /^[a-zA-Z0-9_]+$/;
        if (formData.username && !usernameRegex.test(formData.username)) {
            setErrorMessage("Username can only contain alphanumeric characters and underscores.");
            return;
        }

        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(formData.phone)) {
            setErrorMessage("Your phone number must be exactly 10 digits.");
            return;
        }

        if (!phoneRegex.test(formData.fatherphone)) {
            setErrorMessage("Father's phone number must be exactly 10 digits.");
            return;
        }

        // Basic validation: Check if passwords match before sending to backend
        if (formData.password !== formData.confirmpassword) {
            setErrorMessage("Passwords do not match!");
            return;
        }

        try {
            const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
            const response = await fetch(`${BASE_URL}/register/student`, {
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
            console.log("Registration successful:", data);

            // Redirect to dashboard (or login)
            navigate('/');

        } catch (error) {
            console.log(formData);
            setErrorMessage("Error connecting to the server.");
            console.error("Registration error:", error);
        }
    };

    const showPasswordError = formData.confirmpassword && formData.password !== formData.confirmpassword;

    return (
        <div className="register-page">
            <div className="bg-overlay"></div>
            <div className="register-container">
                <div className="form-box">
                    <h2>Student Registration</h2>

                    <form onSubmit={handleSubmit}>
                        {errorMessage && (
                            <div className="error-banner">
                                {errorMessage}
                            </div>
                        )}

                        <div className="form-grid">
                            {/* Account Details */}
                            <div className="input-group">
                                <i className="fas fa-user"></i>
                                <input type="text" placeholder="Username" name="username" onChange={handleChange} required />
                            </div>

                            <div className="input-group">
                                <i className="fas fa-envelope"></i>
                                <input type="email" placeholder="Email Address" name="email" onChange={handleChange} required />
                            </div>

                            {/* Personal Details */}
                            <div className="input-group">
                                <i className="fas fa-user-tag"></i>
                                <input type="text" placeholder="First Name" name="firstname" onChange={handleChange} required />
                            </div>

                            <div className="input-group">
                                <i className="fas fa-user-tag"></i>
                                <input type="text" placeholder="Middle Name (Opt)" name="middlename" onChange={handleChange} />
                            </div>

                            <div className="input-group">
                                <i className="fas fa-user-tag"></i>
                                <input type="text" placeholder="Last Name" name="lastname" onChange={handleChange} required />
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
                                <i className="fas fa-phone"></i>
                                <input type="tel" placeholder="Your Phone Number" name="phone" maxLength="10" onChange={handleChange} required />
                            </div>

                            {/* Parent Details */}
                            <div className="input-group">
                                <i className="fas fa-user-friends"></i>
                                <input type="text" placeholder="Father's Name" name="fathername" onChange={handleChange} required />
                            </div>

                            <div className="input-group">
                                <i className="fas fa-phone"></i>
                                <input type="tel" placeholder="Father's Phone" name="fatherphone" maxLength="10" onChange={handleChange} required />
                            </div>

                            {/* Academic Details */}
                            <div className="input-group">
                                <i className="fas fa-graduation-cap"></i>
                                <select name="course" value={formData.course} onChange={handleChange} required>
                                    <option value="" disabled>Select Course</option>
                                    <option value="BCA">BCA</option>
                                    <option value="MCA">MCA</option>
                                    <option value="BTech">B.Tech</option>
                                    <option value="MTech">M.Tech</option>
                                    <option value="Diploma">Diploma</option>
                                </select>
                            </div>

                            {/* Passwords */}
                            <div className="input-group">
                                <i className="fas fa-lock"></i>
                                <input type="password" placeholder="Password" name="password" onChange={handleChange} required />
                            </div>

                            <div className="input-group">
                                <i className="fas fa-lock"></i>
                                <input type="password" placeholder="Confirm Password" name="confirmpassword" onChange={handleChange} required />
                                {showPasswordError && (
                                    <span className="inline-error">Passwords do not match!</span>
                                )}
                            </div>

                            <div className="input-group" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '10px 15px', gap: '8px', border: '1px dashed var(--border-color)', background: 'rgba(255, 255, 255, 0.02)' }}>
                                <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "8px" }}>
                                    <i className="fas fa-image"></i> Profile Picture (Optional)
                                </label>
                                <input type="file" accept="image/*" onChange={handleImageChange} style={{ width: "100%", padding: "5px", background: "transparent", border: "none", color: "var(--text-primary)", fontSize: "0.8rem", cursor: "pointer" }} />
                            </div>
                        </div>

                        <button type="submit" className="register-btn">
                            Apply
                        </button>

                        <p className="switch">
                            Already registered? <Link to="/login">Login</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default StudentRegister;