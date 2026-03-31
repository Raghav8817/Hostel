import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import LoginSelector from "./pages/selectors/LoginSelector";
import RegisterSelector from "./pages/selectors/RegisterSelector";
// Login Pages
import AdminLogin from "./pages/admin/AdminLogin";
import StaffLogin from "./pages/staff/StaffLogin";
import StudentLogin from "./pages/student/StudentLogin";
//  Student Dashboard pages
import Profile from "./pages/student/Profile";
import Leave from "./pages/student/Leave";
import Notification from "./pages/student/Notification";
import Complaints from "./pages/student/Complaints";
import Fees from "./pages/student/Fees";
import EditProfile from "./pages/student/EditProfile";
// Registration Pages
import AdminRegister from "./pages/admin/AdminRegister";
import StaffRegister from "./pages/staff/StaffRegister";
import StudentRegister from "./pages/student/StudentRegister";
import Layout from "./pages/student/Layout";
function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={
                    <ProtectedRoute>
                        <Layout />
                    </ProtectedRoute>
                }>
                    {/* All these automatically become protected because they are children of Layout */}
                    <Route index element={<div>Welcome to Dashboard</div>} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="leave" element={<Leave />} />
                    <Route path="complaints" element={<Complaints />} />
                    <Route path="notifications" element={<Notification />} />
                    <Route path="fees" element={<Fees></Fees>}></Route>
                    <Route path="edit" element={<EditProfile></EditProfile>}></Route>
                </Route>

                {/* 3. Auth pages (No Sidebar/Header here) */}
                <Route path="/login" element={<LoginSelector />} />
                <Route path="/register" element={<RegisterSelector />} />
                <Route path="/login/admin" element={<AdminLogin />} />
                <Route path="/login/staff" element={<StaffLogin />} />
                <Route path="/login/student" element={<StudentLogin />} />
                <Route path="/register/admin" element={<AdminRegister />} />
                <Route path="/register/staff" element={<StaffRegister />} />
                <Route path="/register/student" element={<StudentRegister />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
