import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./ProprietarioDashboard.module.css";

export default function ProprietarioDashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const user = JSON.parse(localStorage.getItem("user"));
  const userStatus = user?.status; // PENDING | ACTIVE | REJECTED

  const [ownerExiste, setOwnerExiste] = useState(null);

  useEffect(() => {
    async function checkOwner() {
      try {
        const res = await axios.get(
          "http://localhost:5000/proprietarios/me",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setOwnerExiste(res.data.exists === true);
      } catch {
        setOwnerExiste(false);
      }
    }

    checkOwner();
  }, [token]);

  if (ownerExiste === null) return null;

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

      {ownerExiste && userStatus === "PENDING" && (
        <>
          <p className={styles.text}>
            ⏳ <strong>Under review</strong>
          </p>
          <p className={styles.subtext}>
            Your profile has been submitted and is being reviewed.
          </p>
        </>
      )}

      {ownerExiste && userStatus === "ACTIVE" && (
        <>
          <p className={styles.text}>
            ✅ <strong>Account approved</strong>
          </p>
          <p className={styles.subtext}>
            You can now manage your properties and service requests.
          </p>
        </>
      )}

      {ownerExiste && userStatus === "REJECTED" && (
        <>
          <p className={styles.text}>
            ❌ <strong>Account rejected</strong>
          </p>
          <p className={styles.subtext}>
            Please contact support for more information.
          </p>
        </>
      )}
    </div>
  );
}
