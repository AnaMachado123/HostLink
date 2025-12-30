import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ResetPassword from "./pages/auth/ResetPassword";

// LAYOUT
import HostDashboard from "./pages/dashboard/HostDashboard";

// DASHBOARDS
import EmpresaDashboard from "./pages/dashboard/EmpresaDashboard";
import ProprietarioDashboard from "./pages/dashboard/ProprietarioDashboard";
import GuestDashboard from "./pages/dashboard/GuestDashboard";

// PROFILES
import CompleteCompanyProfile from "./pages/dashboard/CompleteCompanyProfile";
import CompleteOwnerProfile from "./pages/dashboard/CompleteOwnerProfile";
import CompleteGuestProfile from "./pages/dashboard/CompleteGuestProfile";

export default function App() {
  return (
    <Routes>
      {/* AUTH */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ResetPassword />} />

      {/* DASHBOARD LAYOUT */}
      <Route path="/dashboard" element={<HostDashboard />}>
        {/* REDIRECT BASE (temporário) */}
        <Route index element={<Navigate to="empresa" />} />

        {/* EMPRESA */}
        <Route path="empresa" element={<EmpresaDashboard />} />
        <Route path="empresa/profile" element={<CompleteCompanyProfile />} />

        {/* PROPRIETÁRIO */}
        <Route path="proprietario" element={<ProprietarioDashboard />} />
        <Route path="proprietario/profile" element={<CompleteOwnerProfile />} />

        {/* GUEST */}
        <Route path="guest" element={<GuestDashboard />} />
        <Route path="guest/profile" element={<CompleteGuestProfile />} />
      </Route>
    </Routes>
  );
}
