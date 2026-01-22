import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./EmpresaDashboard.module.css";

export default function EmpresaDashboard() {
  const navigate = useNavigate();
  const [empresa, setEmpresa] = useState(null);

  useEffect(() => {
    async function loadEmpresa() {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "http://localhost:5000/empresas/me",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data.exists && res.data.empresa) {
          setEmpresa(res.data.empresa);
        }
      } catch (err) {
        console.error("Erro ao carregar empresa", err);
      }
    }

    loadEmpresa();
  }, []);

  // --------------------------------------------------
  // 1️ ONBOARDING — empresa ainda não existe
  // --------------------------------------------------
  if (!empresa) {
    return (
      <div className={styles.card}>
        <h1 className={styles.title}>Company Dashboard</h1>

        <p className={styles.text}>
          Welcome to your company dashboard.
        </p>

        <p className={styles.subtext}>
          To start using the platform, please complete your company profile.
        </p>

        <button
          className={styles.cta}
          onClick={() => navigate("/dashboard/empresa/profile")}
        >
          Complete company profile
        </button>
      </div>
    );
  }

  // --------------------------------------------------
  // 2️ DASHBOARD — empresa já existe
  // --------------------------------------------------
  return (
    <div className={styles.dashboard}>
      <h1 className={styles.title}>Company Dashboard</h1>

      <p className={styles.subtitle}>
        Manage your services, requests and invoices
      </p>

      <div className={styles.actionsGrid}>
        <button
          className={styles.actionCard}
          onClick={() => navigate("/dashboard/empresa/services")}
        >
          <h3>Services</h3>
          <p>Create and manage your company services.</p>
        </button>

        <button
          className={styles.actionCard}
          onClick={() => navigate("/dashboard/empresa/requests")}
        >
          <h3>Requests</h3>
          <p>View and respond to client requests.</p>
        </button>

        
        <button
          className={styles.actionCard}
          onClick={() => navigate("/dashboard/empresa/invoices")}
        >
          <h3>Invoices</h3>
          <p>View and download issued invoices.</p>
        </button>
      </div>
    </div>
  );
}
