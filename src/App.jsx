import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/admin/Dashboard";

import LoginSelector from "./pages/selectors/LoginSelector";
import RegisterSelector from "./pages/selectors/RegisterSelector";

// Login Pages
import AdminLogin from "./pages/admin/AdminLogin";
import StaffLogin from "./pages/staff/StaffLogin";
import StudentLogin from "./pages/student/StudentLogin";

// Registration Pages
import AdminRegister from "./pages/admin/AdminRegister";
import StaffRegister from "./pages/staff/StaffRegister";
import StudentRegister from "./pages/student/StudentRegister";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Protected Dashboard */}
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

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
                <Route path="*" element={<LoginSelector />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
