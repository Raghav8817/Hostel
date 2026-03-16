import React from "react";
import "./admin-registration.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faUserTag,
  faVenusMars,
  faEnvelope,
  faPhone,
  faLock
} from "@fortawesome/free-solid-svg-icons";

const AdminRegistration = () => {
  return (
    <>
      <div className="bg-overlay"></div>

      <div className="register-container">
        <div className="form-box">
          <h2>Admin Registration</h2>

          <form>
            <div className="form-grid">

              <div className="input-group">
                <FontAwesomeIcon icon={faUser} />
                <input type="text" placeholder="Username" required />
              </div>

              <div className="input-group">
                <FontAwesomeIcon icon={faUserTag} />
                <input type="text" placeholder="First Name" required />
              </div>

              <div className="input-group">
                <FontAwesomeIcon icon={faUserTag} />
                <input type="text" placeholder="Middle Name" />
              </div>

              <div className="input-group">
                <FontAwesomeIcon icon={faUserTag} />
                <input type="text" placeholder="Last Name" required />
              </div>

              <div className="input-group">
                <FontAwesomeIcon icon={faVenusMars} />
                <select name="gender" required>
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="input-group">
                <FontAwesomeIcon icon={faEnvelope} />
                <input type="email" placeholder="Email Address" required />
              </div>

              <div className="input-group">
                <FontAwesomeIcon icon={faPhone} />
                <input type="tel" placeholder="Phone Number" required />
              </div>

              <div className="input-group">
                <FontAwesomeIcon icon={faLock} />
                <input type="password" placeholder="Password" required />
              </div>

              <div className="input-group">
                <FontAwesomeIcon icon={faLock} />
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
    </>
  );
};

export default AdminRegistration;