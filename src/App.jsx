import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

// Layouts
import Layout from "./pages/student/Layout";
import AdminLayout from "./pages/admin/AdminLayout";

// Selectors & Auth
import LoginSelector from "./pages/selectors/LoginSelector";
import RegisterSelector from "./pages/selectors/RegisterSelector";
import ForgotPassword from "./pages/student/Forgot";

// Login Pages
import AdminLogin from "./pages/admin/AdminLogin";
import StaffLogin from "./pages/staff/StaffLogin";
import StudentLogin from "./pages/student/StudentLogin";

// Registration Pages
import AdminRegister from "./pages/admin/AdminRegister";
import StaffRegister from "./pages/staff/StaffRegister";
import StudentRegister from "./pages/student/StudentRegister";

// Student Pages
import Default from "./pages/student/Default";
import Profile from "./pages/student/Profile";
import Leave from "./pages/student/Leave";
import Notification from "./pages/student/Notification";
import Complaints from "./pages/student/Complaints";
import Fees from "./pages/student/Fees";
import EditProfile from "./pages/student/EditProfile";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminStudents from "./pages/admin/AdminStudents";
import AdminProfile from "./pages/admin/AdminProfile";
import AdminRoom from "./pages/admin/AdminRoom";
import AdminComplain from "./pages/admin/AdminComplain";
import AdminFees from "./pages/admin/AdminFees";
import AdminStaff from "./pages/admin/AdminStaff";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* --- PUBLIC AUTH ROUTES --- */}
                {/* These must be OUTSIDE ProtectedRoute so users can see them to log in */}
                <Route path="/login" element={<LoginSelector />} />
                <Route path="/login/admin" element={<AdminLogin />} />
                <Route path="/login/student" element={<StudentLogin />} />
                <Route path="/login/staff" element={<StaffLogin />} />

                <Route path="/register" element={<RegisterSelector />} />
                <Route path="/register/admin" element={<AdminRegister />} />
                <Route path="/register/student" element={<StudentRegister />} />
                <Route path="/register/staff" element={<StaffRegister />} />

                <Route path="/forgot-password" element={<ForgotPassword />} />

                {/* --- STUDENT ROUTES (Protected) --- */}
                <Route path="/" element={
                    <ProtectedRoute>
                        <Layout />
                    </ProtectedRoute>
                }>
                    <Route index element={<Default />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="leave" element={<Leave />} />
                    <Route path="complaints" element={<Complaints />} />
                    <Route path="notifications" element={<Notification />} />
                    <Route path="fees" element={<Fees />} />
                    <Route path="edit" element={<EditProfile />} />
                </Route>

                {/* --- ADMIN ROUTES (Protected) --- */}
                <Route path="/admin" element={
                    <ProtectedRoute>
                        <AdminLayout />
                    </ProtectedRoute>
                }>
                    <Route index element={<AdminDashboard />} />
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="students" element={<AdminStudents />} />
                    <Route path="profile" element={<AdminProfile />} />
                    <Route path="fees" element={<AdminFees />} />
                    <Route path="room" element={<AdminRoom />} />
                    <Route path="complaints" element={<AdminComplain />} />
                    <Route path="staff" element={<AdminStaff />} />
                </Route>

                {/* FALLBACK: Redirect any unknown URL to the login selector */}
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;