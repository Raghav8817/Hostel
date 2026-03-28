import { useNavigate } from "react-router-dom";
function Header() {
    const navigate=useNavigate()
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
        <div className="actions">
        <button className="btn blue">Notifications</button>
        <button className="btn cyan">Leave</button>
        <button className="btn red" onClick={handleLogout}>Logout</button>
        </div>
    </header>
  );
}

export default Header;