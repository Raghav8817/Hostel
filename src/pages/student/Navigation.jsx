import { useNavigate } from "react-router-dom";
import '../../styles/Navigation.css';

function Navigation({ user, onMenuClick }) {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await fetch((import.meta.env.VITE_API_URL || "http://localhost:3000") + '/logout', {
                method: 'POST',
                credentials: 'include'
            });
            navigate('/login');
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <header className="header">
            <div className="nav-left">
                {/* Hamburger Menu Button - Only visible on Mobile */}
                <button className="mobile-menu-btn" onClick={onMenuClick}>
                    <i className="fas fa-bars"></i>
                </button>

                <div className="user-info">
                    <span className="welcome-text">
                        Welcome, <span className="user-name">{user ? `${user.firstname}` : "..."}</span>
                    </span>
                </div>
            </div>

            <div className="actions">
                <button className="nav-icon-btn" onClick={() => navigate('/notifications')} title="Notifications">
                    <i className="fas fa-bell"></i>
                    <span className="badge-dot"></span>
                </button>

                {/* <button className="btn cyan hide-mobile" onClick={() => navigate('/leave')}>
                    Leave
                </button> */}

                <button className="btn red" onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt"></i> <span className="hide-mobile">Logout</span>
                </button>
            </div>
        </header>
    );
}

export default Navigation;