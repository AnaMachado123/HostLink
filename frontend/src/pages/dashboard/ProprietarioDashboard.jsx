import { useEffect, useState } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import axios from "axios";
import styles from "./ProprietarioDashboard.module.css";

export default function ProprietarioDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const [proprietario, setProprietario] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // toast pós submit (igual ao da empresa)
    const submitted = localStorage.getItem("ownerProfileSubmitted");
    if (submitted === "true") {
      setShowToast(true);
      localStorage.removeItem("ownerProfileSubmitted");
      setTimeout(() => setShowToast(false), 3000);
    }

    async function loadProprietario() {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "http://localhost:5000/proprietarios/me",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data.exists) {
          setProprietario(res.data.proprietario);
        } else {
          setProprietario(null);
        }
      } catch (err) {
        console.error("Erro ao carregar proprietario:", err);
        setProprietario(null);
      } finally {
        setLoading(false);
      }
    }

    loadProprietario();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  const isProfileRoute =
    location.pathname === "/dashboard/proprietario/profile";

  const isBaseDashboard =
    location.pathname === "/dashboard/proprietario";

  // --------------------------------------------------
  // 1️⃣ ONBOARDING ANTES DO PERFIL
  // --------------------------------------------------
  if (!proprietario && !isProfileRoute) {
    return (
      <div className={styles.card}>
        <h1 className={styles.title}>Property Owner Dashboard</h1>

        <p className={styles.text}>
          Welcome to your owner dashboard.
        </p>

        <p className={styles.subtext}>
          To start using the platform, please complete your owner profile.
        </p>

        <button
          className={styles.cta}
          onClick={() =>
            navigate("/dashboard/proprietario/profile")
          }
        >
          Complete owner profile
        </button>
      </div>
    );
  }

  // --------------------------------------------------
  // 2️⃣ SUB-PÁGINAS
  // --------------------------------------------------
  if (!isBaseDashboard) {
    return <Outlet />;
  }

  // --------------------------------------------------
  // 3️⃣ DASHBOARD HOME
  // --------------------------------------------------
  return (
    <>
      {showToast && (
        <div className={styles.toastSuccess}>
          Profile submitted and sent for review
        </div>
      )}

      <div className={styles.dashboard}>
        <h1 className={styles.title}>Property Owner Dashboard</h1>

        <p className={styles.subtitle}>
          Manage your properties, requests and invoices
        </p>

        <div className={styles.actionsGrid}>
          <button
            className={styles.actionCard}
            onClick={() =>
              navigate("/dashboard/proprietario/properties")
            }
          >
            <h3>Properties</h3>
            <p>Create and manage your properties.</p>
          </button>

          <button
            className={styles.actionCard}
            onClick={() =>
              navigate("/dashboard/proprietario/services")
            }
          >
            <h3>Requests</h3>
            <p>Browse services and request one.</p>
          </button>

          <button
            className={styles.actionCard}
            onClick={() =>
              navigate("/dashboard/proprietario/invoices")
            }
          >
            <h3>Invoices</h3>
            <p>View and download your invoices.</p>
          </button>
        </div>
      </div>
    </>
  );
}
