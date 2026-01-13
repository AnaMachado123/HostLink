import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./ProprietarioDashboard.module.css";

export default function ProprietarioDashboard() {
  const navigate = useNavigate();
  const [proprietario, setProprietario] = useState(null);
  const [showToast, setShowToast] = useState(false);


  useEffect(() => {
  //  TOAST PÓS-SUBMISSÃO (igual à empresa)
  const submitted = localStorage.getItem("ownerProfileSubmitted");

  if (submitted === "true") {
    setShowToast(true);
    localStorage.removeItem("ownerProfileSubmitted");

    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  }

  //  load normal do proprietário
  async function loadProprietario() {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/proprietarios/me",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.exists && res.data.proprietario) {
        setProprietario(res.data.proprietario);
      }
    } catch (err) {
      console.error("Erro ao carregar proprietário", err);
    }
  }

  loadProprietario();
}, []);


  // --------------------------------------------------
  // 1️⃣ ONBOARDING — proprietário ainda não existe
  // --------------------------------------------------
  if (!proprietario) {
    return (
      <div className={styles.card}>
        <h1 className={styles.title}>Owner Dashboard</h1>

        <p className={styles.text}>
          Welcome to your owner dashboard.
        </p>

        <p className={styles.subtext}>
          To start using the platform, please complete your owner profile.
        </p>

        <button
          className={styles.cta}
          onClick={() => navigate("/dashboard/proprietario/profile")}
        >
          Complete owner profile
        </button>
      </div>
    );
  }

  // --------------------------------------------------
  // 2️⃣ DASHBOARD — proprietário já existe
  // --------------------------------------------------
  return (
  <>
    {showToast && (
      <div className={styles.toastSuccess}>
        Profile submitted and sent for review
      </div>
    )}

    <div className={styles.dashboard}>
      <h1 className={styles.title}>Owner Dashboard</h1>

      <p className={styles.subtitle}>
        Manage your properties and requests
      </p>

      <div className={styles.actionsGrid}>
        <button
          className={styles.actionCard}
          onClick={() => navigate("/dashboard/proprietario/properties")}
        >
          <h3>Properties</h3>
          <p>Create and manage your properties.</p>
        </button>

        <button
          className={styles.actionCard}
          onClick={() => navigate("/dashboard/proprietario/requests")}
        >
          <h3>Requests</h3>
          <p>View the services available and do a request.</p>
        </button>
      </div>
    </div>
  </>
);
}