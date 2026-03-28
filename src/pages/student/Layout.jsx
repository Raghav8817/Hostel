import '../../styles/Layout.css'
import Header from "./Header";
import Sidebar from "./Sidebar";
import Notification from "./Notification";
import { Outlet, useNavigate } from 'react-router-dom';

function Layout() {
  console.log("layout called");
  
  return (
    <div className="layout">

      <Header />

      <div className="Sidebar">
        <Sidebar />

        <main className="main">
          <Outlet></Outlet>
        </main>
      </div>

    </div>
  );
}

export default Layout;