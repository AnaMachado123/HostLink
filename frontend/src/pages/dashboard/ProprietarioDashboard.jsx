import { useNavigate } from "react-router-dom";
import styles from "./ProprietarioDashboard.module.css";

export default function ProprietarioDashboard() {
  const navigate = useNavigate();

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Property Owner Dashboard</h2>

      <p className={styles.text}>
        Welcome to your property owner dashboard.
      </p>

      <p className={styles.text}>
        Here you will be able to manage your properties and requests.
      </p>

      <p className={styles.subtext}>
        Your account will be reviewed by an administrator.
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
