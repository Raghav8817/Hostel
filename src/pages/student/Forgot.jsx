import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Forgot.css';

const ForgotPassword = () => {
    const navigate = useNavigate();

    return (
        <>
            <div className="bg-overlay"></div>

            <div className="forgot-container">
                <div className="form-box">
                    <h2>Password Reset</h2>

                    <p className="subtitle" style={{ marginTop: '15px', lineHeight: '1.6' }}>
                        Automated email / OTP password reset is currently disabled.
                        <br />
                        Please contact your Hostel Administrator to reset your password or update account details.
                    </p>

                    <div className="switch" style={{ marginTop: '30px' }}>
                        <span onClick={() => navigate('/')} style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                            ← Back to Home
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ForgotPassword;
