import { useNavigate } from "react-router-dom";
import '../../styles/Navigation.css'; 
function Navigation({ user }) {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await fetch((import.meta.env.VITE_API_URL || "http://localhost:3000") + '/logout', {
                method: 'POST',
                credentials: 'include'
            });
            // Clear any local storage if you use it, then redirect
            navigate('/login');
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <header className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px' }}>
            <div className="user-info">
                {/* Renders the name from the database table passed down from Layout */}
                <span style={{ color: '#00c6ff', fontWeight: 'bold' }}>
                    Welcome, {user ? `${user.firstname} ${user.lastname}` : "Loading..."}
                </span>
            </div>

            <div className="actions" style={{ display: 'flex', gap: '10px' }}>
                <button className="btn blue">Notifications</button>

                <button className="btn cyan" onClick={() => navigate('/leave')}>
                    Leave
                </button>

                <button className="btn red" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </header>
    );
}

export default Navigation;