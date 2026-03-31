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
        year: "",            // New Field
        password: "",
        confirmpassword: "",
    });

    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

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
                                <input type="number" placeholder="Your Phone Number" name="phone" onChange={handleChange} required />
                            </div>

                            {/* Parent Details */}
                            <div className="input-group">
                                <i className="fas fa-user-friends"></i>
                                <input type="text" placeholder="Father's Name" name="fathername" onChange={handleChange} required />
                            </div>

                            <div className="input-group">
                                <i className="fas fa-phone-alt"></i>
                                <input type="number" placeholder="Father's Phone" name="fatherphone" onChange={handleChange} required />
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