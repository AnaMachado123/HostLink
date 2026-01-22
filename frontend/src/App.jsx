import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* AUTH */
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ResetPassword from "./pages/auth/ResetPassword";

/* LAYOUT */
import HostDashboard from "./pages/dashboard/HostDashboard";

/* DASHBOARDS */
import EmpresaDashboard from "./pages/dashboard/EmpresaDashboard";
import ProprietarioDashboard from "./pages/dashboard/ProprietarioDashboard";
import GuestDashboard from "./pages/dashboard/GuestDashboard";

/* PROFILES */
import CompleteCompanyProfile from "./pages/dashboard/CompleteCompanyProfile";
import CompleteOwnerProfile from "./pages/dashboard/CompleteOwnerProfile";
import CompleteGuestProfile from "./pages/dashboard/CompleteGuestProfile";

/* EMPRESA */
import Services from "./pages/empresa/Services";
import EmpresaRequests from "./pages/empresa/EmpresaRequests";

/* PROPRIETÁRIO */
import Properties from "./pages/proprietario/Properties";
import ViewProperty from "./pages/proprietario/ViewProperty";
import RequestServices from "./pages/proprietario/RequestServices";
import MyRequests from "./pages/proprietario/MyRequests";

/* INVOICES */
import Invoices from "./pages/invoices/Invoices";
import InvoiceView from "./pages/invoices/InvoiceView";

export default function App() {
  return (
    <>
      <ToastContainer position="top-right" />

      <Routes>
        {/* AUTH */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ResetPassword />} />

        {/* DASHBOARD LAYOUT */}
        <Route path="/dashboard" element={<HostDashboard />}>
          <Route index element={<Navigate to="empresa" replace />} />

          {/* EMPRESA */}
          <Route path="empresa" element={<EmpresaDashboard />} />
          <Route path="empresa/profile" element={<CompleteCompanyProfile />} />
          <Route path="empresa/services" element={<Services />} />
          <Route path="empresa/requests" element={<EmpresaRequests />} />
          <Route path="empresa/invoices" element={<Invoices />} />
          <Route path="empresa/invoices/:id" element={<InvoiceView />} />

          {/* PROPRIETÁRIO */}
          <Route path="proprietario" element={<ProprietarioDashboard />}>
            <Route index element={<Navigate to="properties" replace />} />
            <Route path="profile" element={<CompleteOwnerProfile />} />
            <Route path="properties" element={<Properties />} />
            <Route path="properties/:id" element={<ViewProperty />} />
            <Route path="services" element={<RequestServices />} />
            <Route path="my-requests" element={<MyRequests />} />
            <Route path="invoices" element={<Invoices />} />
            <Route path="invoices/:id" element={<InvoiceView />} />
          </Route>

          {/* GUEST */}
          <Route path="guest" element={<GuestDashboard />} />
          <Route path="guest/profile" element={<CompleteGuestProfile />} />
        </Route>
      </Routes>
    </>
  );
}
