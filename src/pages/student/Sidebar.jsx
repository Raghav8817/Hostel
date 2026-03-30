import { NavLink } from "react-router-dom";
// Optional: If you want icons, ensure you have font-awesome linked in index.html
import '../../styles/Sidebar.css'
function Sidebar({ user }) {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="avatar">
          {user?.firstname?.charAt(0) || "K"}
        </div>
        <h2 className="logo-text">{user ? `${user.firstname}` : "User"}</h2>
      </div>

      <nav className="sidebar-nav">
        <ul>
          <li>
            <NavLink to="/" end className={({ isActive }) => isActive ? "active" : ""}>
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/profile" className={({ isActive }) => isActive ? "active" : ""}>
              Profile
            </NavLink>
          </li>
          <li>
            <NavLink to="/notifications" className={({ isActive }) => isActive ? "active" : ""}>
              Notifications
            </NavLink>
          </li>
          <li>
            <NavLink to="/fees" className={({ isActive }) => isActive ? "active" : ""}>
              Fees
            </NavLink>
          </li>
          <li>
            <NavLink to="/complaints" className={({ isActive }) => isActive ? "active" : ""}>
              Complaints
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;