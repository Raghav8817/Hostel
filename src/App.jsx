import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import LoginSelector from "./pages/selectors/LoginSelector";
import RegisterSelector from "./pages/selectors/RegisterSelector";
// Login Pages
import AdminLogin from "./pages/admin/AdminLogin";
import StaffLogin from "./pages/staff/StaffLogin";
import StudentLogin from "./pages/student/StudentLogin";
// Dashboard pages
import Profile from "./pages/student/Profile";
import Leave from "./pages/student/Leave";
// Registration Pages
import AdminRegister from "./pages/admin/AdminRegister";
import StaffRegister from "./pages/staff/StaffRegister";
import StudentRegister from "./pages/student/StudentRegister";
import Layout from "./pages/student/Layout";
function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Protected Dashboard */}
                <Route path="/" element={<ProtectedRoute>
                    <Layout>
                    </Layout>
                </ProtectedRoute>} />
                <Route path="/leave" element={<Leave></Leave>}></Route>
                <Route path="/profile" element={<Profile/>}></Route>

                {/* Role Selector */}
                <Route path="/login" element={<LoginSelector />} />
                <Route path="/register" element={<RegisterSelector />} />

                {/* Specific Role Logins */}
                <Route path="/login/admin" element={<AdminLogin />} />
                <Route path="/login/staff" element={<StaffLogin />} />
                <Route path="/login/student" element={<StudentLogin />} />

                {/* Specific Role Registrations */}
                <Route path="/register/admin" element={<AdminRegister />} />
                <Route path="/register/staff" element={<StaffRegister />} />
                <Route path="/register/student" element={<StudentRegister />} />
                
                {/* Fallback routing */}
                {/* <Route path="*" element={<StudentDash></StudentDash>} /> */}
            </Routes>
        </BrowserRouter>
    );
}

export default App;
