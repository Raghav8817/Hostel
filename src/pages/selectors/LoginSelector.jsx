import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/LoginSelector.css';

const LoginSelector = () => {
    const navigate = useNavigate();

    const roles = [
        {
            title: 'Student',
            description: 'Access your student dashboard, view notices, and manage requests.',
            icon: 'fas fa-user-graduate',
            colorClass: 'role-student',
            path: '/login/student',
        },
        {
            title: 'Staff',
            description: 'Manage your tasks, view resident records, and update status.',
            icon: 'fas fa-users-cog',
            colorClass: 'role-staff',
            path: '/login/staff',
        },
        {
            title: 'Admin',
            description: 'Full system control, manage staff, oversee all operations.',
            icon: 'fas fa-user-shield',
            colorClass: 'role-admin',
            path: '/login/admin',
        }
    ];

    return (
        <div className="selector-container">
            <div className="selector-header">
                <h1>Welcome Back</h1>
                <p>Please select your role to continue securely</p>
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
                            <span>Login as {role.title}</span>
                            <i className="fas fa-arrow-right"></i>
                        </div>
                    </div>
                ))}
            </div>

            <div className="selector-footer">
                <p>Don't have an account? <span onClick={() => navigate('/register')} className="selector-link">Register here</span></p>
            </div>
        </div>
    );
};

export default LoginSelector;
