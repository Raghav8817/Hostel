import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <div className="sidebar">
      <h2 className="logo">Karan Kumar</h2>

      <ul>
        <li>
          <NavLink to="/StudentDash">Dashboard</NavLink>
        </li>

        <li>
          <NavLink to="/profile">Profile</NavLink>
        </li>

        <li>
          <NavLink to="/attendance">Attendance</NavLink>
        </li>

        <li>
          <NavLink to="/fees">Fees</NavLink>
        </li>

        <li>
          <NavLink to="/courses">Courses</NavLink>
        </li>

        <li>
          <NavLink to="/complaints">Complaints</NavLink>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;