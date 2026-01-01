import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./EmpresaDashboard.module.css";

export default function EmpresaDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const userStatus = user?.status; // PENDING | ACTIVE | REJECTED

  const navigate = useNavigate();
  const [empresa, setEmpresa] = useState(null);

  useEffect(() => {
    async function loadEmpresa() {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "http://localhost:5000/empresas/me",
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        if (res.data.exists) {
          setEmpresa(res.data.empresa);
        }
      } catch (err) {
        console.error("Erro ao carregar empresa", err);
      }
    }

    loadEmpresa();
  }, []);

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Company Dashboard</h2>

      {!empresa && (
        <>
          <p className={styles.text}>
            Welcome to your company dashboard.
          </p>

          <p className={styles.subtext}>
            Please complete your company profile to continue.
          </p>

          <button
            className={styles.cta}
            onClick={() => navigate("/dashboard/empresa/profile")}
          >
            Complete company profile
          </button>
        </>
      )}

      {empresa && userStatus === "PENDING" && (
        <>
          <p className={styles.subtext}>
            ⏳ <strong>Under review</strong>
          </p>

          <p className={styles.text}>
            Your company profile has been submitted successfully.
          </p>

          <p className={styles.text}>
            An administrator is reviewing your information.
          </p>
        </>
      )}

      {empresa && userStatus === "ACTIVE" && (
        <>
          <p className={styles.subtext}>
            ✅ <strong>Account approved</strong>
          </p>

          <p className={styles.text}>
      Your account has been approved.
          </p>

          <p className={styles.text}>
            You can now manage your services and requests.
          </p>
        </>
      )}

      {empresa && userStatus === "REJECTED" && (
        <>
          <p className={styles.subtext}>
            ❌ <strong>Account rejected</strong>
          </p>

          <p className={styles.text}>
            Your account was rejected by the administrator.
          </p>
        </>
      )}

    </div>
  );
      }
