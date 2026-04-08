import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/LoginSelector.css'; // Re-using the beautiful CSS from Login Selector

const RegisterSelector = () => {
    const navigate = useNavigate();

    const roles = [
        {
            title: 'Student',
            description: 'Register as a new student to apply for a room, view notices, and manage your stay.',
            icon: 'fas fa-user-graduate',
            colorClass: 'role-student',
            path: '/register/student',
        },
        {
            title: 'Admin',
            description: 'Register a master administrator account to oversee operations systems.',
            icon: 'fas fa-user-shield',
            colorClass: 'role-admin',
            path: '/register/admin',
        },
        {
            title: 'Staff',
            description: 'Register a new staff member account to manage maintenance and hostel tasks.',
            icon: 'fas fa-users-cog',
            colorClass: 'role-staff',
            path: '/register/staff',
        }
    ];

    return (
        <div className="selector-container">
            <div className="selector-header">
                <h1>Join the Portal</h1>
                <p>Please select your role to create a new account</p>
            </div>
            
            <div className="cards-wrapper">
                {roles.map((role, index) => (
                    <div 
                        key={index} 
                        className={`role-card ${role.colorClass}`}
                        onClick={() => navigate(role.path)}
                    >
                        <div className="card-icon-wrapper">
                            <i className={role.icon}></i>
                        </div>
                        <h2>{role.title}</h2>
                        <p>{role.description}</p>
                        <div className="card-action">
                            <span>Register as {role.title}</span>
                            <i className="fas fa-arrow-right"></i>
                        </div>
                    </div>
                ))}
            </div>

            <div className="selector-footer">
                <p>Already have an account? <span onClick={() => navigate('/login')} className="selector-link">Login here</span></p>
            </div>
        </div>
    );
};

export default RegisterSelector;
