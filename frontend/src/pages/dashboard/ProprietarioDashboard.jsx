import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./ProprietarioDashboard.module.css";

export default function ProprietarioDashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [ownerExiste, setOwnerExiste] = useState(null); // null = loading
  const [ownerStatus, setOwnerStatus] = useState(null); // pending | approved

  // ---------------------------------------------
  // CHECK OWNER PROFILE
  // ---------------------------------------------
  useEffect(() => {
    async function checkOwner() {
      try {
        const res = await axios.get(
          "http://localhost:5000/proprietarios/me",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data.exists) {
          setOwnerExiste(true);
          setOwnerStatus(res.data.proprietario.status);
        } else {
          setOwnerExiste(false);
          setOwnerStatus(null);
        }
      } catch (err) {
        console.error("Erro ao verificar proprietário", err);
        setOwnerExiste(false);
      }
    }

    checkOwner();
  }, [token]);

  // evita flicker
  if (ownerExiste === null) return null;

  // ---------------------------------------------
  // RENDER
  // ---------------------------------------------
  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Property Owner Dashboard</h2>

      {!ownerExiste && (
        <>
          <p className={styles.text}>
            Welcome to your property owner dashboard.
          </p>

          <p className={styles.subtext}>
            To continue, please complete your profile.
          </p>

          <button
            className={styles.cta}
            onClick={() => navigate("/dashboard/proprietario/profile")}
          >
            Complete owner profile
          </button>
        </>
      )}

      {ownerExiste && ownerStatus === "pending" && (
        <>
          <p className={styles.text}>
            ⏳ <strong>Profile submitted</strong>
          </p>

          <p className={styles.subtext}>
            Your account is under review by an administrator.
          </p>
        </>
      )}

      {ownerExiste && ownerStatus === "approved" && (
        <>
          <p className={styles.text}>
            ✅ Your account has been approved.
          </p>

          <p className={styles.subtext}>
            You can now manage your properties and requests.
          </p>
        </>
      )}
    </div>
  );
}
