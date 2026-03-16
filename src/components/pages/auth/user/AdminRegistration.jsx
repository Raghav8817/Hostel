import { useState } from "react";
import "../../../../styles/AdminRegistration.css";

function AdminRegistration() {
    return (
        <div>
            <div className="bg-overlay"></div>

            <div className="register-container">
                <div className="form-box">
                    <h2>Admin Registration</h2>

                    <form action="#">
                        <div className="form-grid">

                            <div className="input-group">
                                <i className="fas fa-user"></i>
                                <input type="text" placeholder="Username" required />
                            </div>

                            <div className="input-group">
                                <i className="fas fa-user-tag"></i>
                                <input type="text" placeholder="First Name" required />
                            </div>

                            <div className="input-group">
                                <i className="fas fa-user-tag"></i>
                                <input type="text" placeholder="Middle Name" />
                            </div>

                            <div className="input-group">
                                <i className="fas fa-user-tag"></i>
                                <input type="text" placeholder="Last Name" required />
                            </div>

                            <div className="input-group">
                                <i className="fas fa-venus-mars"></i>
                                <select name="gender" defaultValue="">
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
                                <input type="email" placeholder="Email Address" required />
                            </div>

                            <div className="input-group">
                                <i className="fas fa-phone"></i>
                                <input type="tel" placeholder="Phone Number" required />
                            </div>

                            <div className="input-group">
                                <i className="fas fa-lock"></i>
                                <input type="password" placeholder="Password" required />
                            </div>

                            <div className="input-group">
                                <i className="fas fa-lock"></i>
                                <input type="password" placeholder="Confirm Password" required />
                            </div>

                        </div>

                        <button type="submit" className="register-btn">
                            Register Admin
                        </button>

                        <p className="switch">
                            Already registered? <a href="/adminlog">Login</a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AdminRegistration;