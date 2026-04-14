import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import "../../styles/RegisterShared.css";

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
        fathername: "",
        fatherphone: "",
        course: "",
        password: "",
        confirmpassword: "",
        profile_pic: "",
        otp: ""
    });

    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [otpLoading, setOtpLoading] = useState(false);
    const [isVerified, setIsVerified] = useState(false);

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

    const handleSendOtp = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setErrorMessage("Please enter a valid email address first.");
            return;
        }

        setOtpLoading(true);
        setErrorMessage("");
        setSuccessMessage("");
        try {
            const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
            const res = await fetch(`${BASE_URL}/send-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: formData.email })
            });
            const data = await res.json();
            if (res.ok) {
                setOtpSent(true);
                setSuccessMessage("OTP sent to your email!");
            } else {
                setErrorMessage(data.error || "Failed to send OTP.");
            }
        } catch (error) {
            setErrorMessage("Connection error.");
        } finally {
            setOtpLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (!formData.otp || formData.otp.length !== 6) {
            setErrorMessage("Please enter the 6-digit OTP.");
            return;
        }

        setOtpLoading(true);
        setErrorMessage("");
        setSuccessMessage("");
        try {
            const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
            const res = await fetch(`${BASE_URL}/verify-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: formData.email, otp: formData.otp })
            });
            const data = await res.json();
            if (res.ok) {
                setIsVerified(true);
                setSuccessMessage("Email verified successfully! You can now register.");
            } else {
                setErrorMessage(data.error || "Invalid OTP.");
            }
        } catch (error) {
            setErrorMessage("Connection error.");
        } finally {
            setOtpLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isVerified) {
            setErrorMessage("Please verify your email with OTP first.");
            return;
        }

        const nameRegex = /^[A-Z][a-z\s]+$/; 
        if (!nameRegex.test(formData.firstname) || !nameRegex.test(formData.lastname)) {
            setErrorMessage("Names must start with a capital letter.");
            return;
        }

        const phoneRegex = /^[6-9]\d{9}$/; 
        if (!phoneRegex.test(formData.phone) || !phoneRegex.test(formData.fatherphone)) {
            setErrorMessage("Phone numbers must be 10 digits and start with 6-9.");
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
            const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
            const response = await fetch(`${BASE_URL}/register/student`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            if (!response.ok) {
                setErrorMessage(data.error || "Failed to register.");
                return;
            }

            navigate('/');
        } catch (error) {
            setErrorMessage("Error connecting to the server.");
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            const form = e.currentTarget;
            // Target only text-entry and selection fields for natural typing flow
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
                    <h2>Student Registration</h2>

                    <form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
                        <div className="form-grid">
                            <div className="input-group">
                                <i className="fas fa-user"></i>
                                <input type="text" placeholder="Username" name="username" onChange={handleChange} required />
                            </div>

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
                                <input type="tel" placeholder="Your Phone" name="phone" maxLength="10" onChange={handleChange} required />
                            </div>

                            <div className="input-group">
                                <i className="fas fa-user-friends"></i>
                                <input type="text" placeholder="Father's Name" name="fathername" onChange={handleChange} required />
                            </div>

                            <div className="input-group">
                                <i className="fas fa-phone"></i>
                                <input type="tel" placeholder="Father's Phone" name="fatherphone" maxLength="10" onChange={handleChange} required />
                            </div>

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

                            <div className="input-group">
                                <i className="fas fa-lock"></i>
                                <input type="password" placeholder="Password" name="password" onChange={handleChange} required />
                            </div>

                             <div className="input-group">
                                <i className="fas fa-lock"></i>
                                <input type="password" placeholder="Confirm Password" name="confirmpassword" onChange={handleChange} required />
                            </div>

                            <div className="input-group" style={{ gridColumn: 'span 2', display: 'flex', gap: '10px', flexDirection: 'row', alignItems: 'flex-start' }}>
                                <div style={{ flex: 1, position: 'relative' }}>
                                    <i className="fas fa-envelope" style={{ top: '50%', left: '17px', transform: 'translateY(-50%)' }}></i>
                                    <input type="email" placeholder="Email Address" name="email" onChange={handleChange} required disabled={isVerified} style={{ paddingLeft: '3rem' }} />
                                </div>
                                {!isVerified && (
                                    <button type="button" onClick={handleSendOtp} disabled={otpLoading} style={{ height: '52px', background: 'var(--accent, #43e97b)', color: '#000', border: 'none', padding: '0 25px', borderRadius: '12px', cursor: 'pointer', fontSize: '0.95rem', fontWeight: '800', transition: 'all 0.3s ease', boxShadow: '0 4px 15px rgba(67, 233, 123, 0.2)', minWidth: '120px' }}>
                                        {otpLoading ? "..." : (otpSent ? "Resend" : "Send OTP")}
                                    </button>
                                )}
                            </div>

                            {otpSent && !isVerified && (
                                <div className="input-group" style={{ gridColumn: 'span 2', display: 'flex', gap: '10px', flexDirection: 'row', alignItems: 'flex-start' }}>
                                    <div style={{ flex: 1, position: 'relative' }}>
                                        <i className="fas fa-key" style={{ top: '50%', left: '17px', transform: 'translateY(-50%)' }}></i>
                                        <input type="text" placeholder="Enter 6-digit OTP" name="otp" maxLength="6" onChange={handleChange} required style={{ paddingLeft: '3rem' }} />
                                    </div>
                                    <button type="button" onClick={handleVerifyOtp} disabled={otpLoading} style={{ height: '52px', background: '#22c55e', color: '#fff', border: 'none', padding: '0 25px', borderRadius: '12px', cursor: 'pointer', fontSize: '0.95rem', fontWeight: '800', transition: 'all 0.3s ease', boxShadow: '0 4px 15px rgba(34, 197, 94, 0.2)', minWidth: '120px' }}>
                                        {otpLoading ? "..." : "Verify OTP"}
                                    </button>
                                </div>
                            )}

                            <div className="input-group" style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '10px 15px', gap: '8px', border: '1px dashed var(--border-color)', background: 'rgba(255, 255, 255, 0.02)' }}>
                                <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "8px" }}>
                                    <i className="fas fa-image"></i> Profile Picture (Optional)
                                </label>
                                <input type="file" accept="image/*" onChange={handleImageChange} style={{ width: "100%", padding: "5px", background: "transparent", border: "none", color: "var(--text-primary)", fontSize: "0.8rem", cursor: "pointer" }} />
                            </div>
                        </div>

                        {errorMessage && <div className="error-banner">{errorMessage}</div>}
                        {successMessage && <div className="success-banner">{successMessage}</div>}

                        <button type="submit" className="register-btn" disabled={!isVerified}>
                            Submit Application
                        </button>

                        <div className="switch">
                            Already registered? <div onClick={() => navigate('/login/student')}>Login</div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default StudentRegister;