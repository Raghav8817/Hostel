import { useState } from "react";
import "../../styles/AdminRegistration.css";
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
function AdminRegistration() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        middlename:"",
        firstname: "",
        lastname: "",
        gender:"",
        email: "",
        phone: "",
        password: "",
        confirmpassword:"",
    });
    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        if (formData.phone.length !== 10) {
            // window.alert("provide valid phone");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch((import.meta.env.VITE_API_URL || "http://localhost:3000") + "/register", { 
                method: 'POST', 
                headers: { 
                    'Content-Type': 'application/json' 
                }, 
                credentials: 'include',
                body: JSON.stringify(formData) 
            })
            const data = await response.json();
            
            if (!response.ok) {
                setErrorMessage(data.error || "Failed to register.");
                return;
            }

            setErrorMessage("");
            console.log("passed to backend", data);
            
            // Automatically log the user in by navigating to dashboard
            navigate('/dashboard');
            
        } catch (error) {
            setErrorMessage("Error connecting to the server.");
            console.error("error sending form data to backend", error);
        }
    
    };

    // A readable variable: TRUE if user started typing a confirmation password AND it doesn't match the original
    const showPasswordError = formData.confirmpassword && formData.password !== formData.confirmpassword;

    return (
        <div>
            <div className="bg-overlay"></div>
            <div className="register-container">
                <div className="form-box">
                    <h2>Admin Registration</h2>

                    <form action="#" onSubmit={handleSubmit}>
                        {errorMessage && (
                            <div style={{ color: "red", backgroundColor: "#ffe6e6", padding: "10px", borderRadius: "5px", marginBottom: "15px", textAlign: "center" }}>
                                {errorMessage}
                            </div>
                        )}
                        <div className="form-grid">

                            <div className="input-group">
                                <i className="fas fa-user"></i>
                                <input type="text" placeholder="Username"  name="username" onChange={handleChange} required/>
                            </div>

                            <div className="input-group">
                                <i className="fas fa-user-tag"></i>
                                <input type="text" placeholder="First Name" name="firstname" required onChange={handleChange} />
                            </div>

                            <div className="input-group">
                                <i className="fas fa-user-tag"></i>
                                <input type="text" placeholder="Middle Name" name="middlename" onChange={handleChange}/>
                            </div>

                            <div className="input-group">
                                <i className="fas fa-user-tag"></i>
                                <input type="text" placeholder="Last Name" name="lastname" required  onChange={handleChange}/>
                            </div>

                            <div className="input-group">
                                <i className="fas fa-venus-mars"></i>
                                <select name="gender" defaultValue="" onChange={handleChange} required>
                                    <option value="" disabled>
                                        Select Gender
                                    </option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div className="input-group">
                                <i className="fas fa-envelope"></i>
                                <input type="email" placeholder="Email Address" name="email" required  onChange={handleChange}/>
                            </div>

                            <div className="input-group">
                                <i className="fas fa-phone"></i>
                                <input type="number" placeholder="Phone Number" name="phone" required  onChange={handleChange}/>
                            </div>

                            <div className="input-group">
                                <i className="fas fa-lock"></i>
                                <input type="password" placeholder="Password" name="password"required onChange={handleChange} />
                            </div>

                            <div className="input-group">
                                <i className="fas fa-lock"></i>
                                
                                <input type="password" placeholder="Confirm Password" name="confirmpassword" required  onChange={handleChange}/>
                                
                                {showPasswordError ? (
                                    <div style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>
                                        Passwords do not match!
                                    </div>
                                ) : null}
                            </div>

                        </div>

                        <button type="submit" className="register-btn">
                            Register Admin
                        </button>

                        <p className="switch">
                            Already registered? <Link to="/Dashboard">Login</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AdminRegistration;
