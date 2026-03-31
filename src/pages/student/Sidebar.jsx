import { NavLink } from "react-router-dom";
import '../../styles/Sidebar.css'

function Sidebar({ user }) {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="avatar-container">
          {/* 
              If user has a profile_pic, show it. 
              Otherwise, show the first letter of their name.
          */}
          {user?.profile_pic ? (
            <img
              src={user.profile_pic}
              alt="User Avatar"
              className="sidebar-avatar-img"
            />
          ) : (
            <div className="avatar-letter">
              {user?.firstname?.charAt(0) || "U"}
            </div>
          )}
        </div>
        <div className="user-meta">
          <h2 className="logo-text">{user ? `${user.firstname} ${user.lastname}` : "Guest User"}</h2>
          <span className="user-role">{user?.role || 'Student'}</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <ul>
          <li>
            <NavLink to="/" end className={({ isActive }) => isActive ? "active" : ""}>
              <i className="fas fa-th-large"></i> Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/profile" className={({ isActive }) => isActive ? "active" : ""}>
              <i className="fas fa-user"></i> Profile
            </NavLink>
          </li>
          { <li>
            <NavLink to="/leave" className={({ isActive }) => isActive ? "active" : ""}>
              <i className="fas fa-bell"></i> Leave
            </NavLink>
          </li> }
          <li>
            <NavLink to="/fees" className={({ isActive }) => isActive ? "active" : ""}>
              <i className="fas fa-file-invoice-dollar"></i> Fees
            </NavLink>
          </li>
          <li>
            <NavLink to="/complaints" className={({ isActive }) => isActive ? "active" : ""}>
              <i className="fas fa-exclamation-circle"></i> Complaints
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;