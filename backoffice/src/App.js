import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ManageUsers from "./pages/ManageUsers";
import ManageCompanies from "./pages/ManageCompanies";
import ManageServices from "./pages/ManageServices";
import ReviewUser from "./pages/ReviewUser";
import AdminDashboardHome from "./pages/AdminDashboardHome";



import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* default */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* login */}
        <Route path="/login" element={<AdminLogin />} />

        {/* admin area protegida */}
        <Route path="/admin" 
          element={ 
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboardHome />} />


          <Route path="users" element={<ManageUsers />} />
          <Route path="users/:id" element={<ReviewUser />} />
          <Route path="companies" element={<ManageCompanies />} />
          <Route path="services" element={<ManageServices />} />
        </Route>

        {/* fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
