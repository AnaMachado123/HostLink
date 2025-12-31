import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./GuestDashboard.module.css";

export default function GuestDashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // null = loading | false = não existe | true = existe
  const [guestExiste, setGuestExiste] = useState(null);

  // ------------------------------------
  // CHECK GUEST PROFILE
  // ------------------------------------
  useEffect(() => {
    async function checkGuest() {
      try {
        const res = await axios.get(
          "http://localhost:5000/guests/me",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setGuestExiste(res.data.exists === true);
      } catch {
        setGuestExiste(false);
      }
    }

    checkGuest();
  }, [token]);

  // evita flicker
  if (guestExiste === null) return null;

  // ------------------------------------
  // RENDER
  // ------------------------------------
  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Guest Dashboard</h2>

      {!guestExiste ? (
        <>
          <p className={styles.text}>
            Welcome to HostLink.
          </p>

          <p className={styles.subtext}>
            Please complete your profile to start using all platform features.
          </p>

          <button
            className={styles.cta}
            onClick={() => navigate("/dashboard/guest/profile")}
          >
            Complete your profile
          </button>
        </>
      ) : (
        <>
          <p className={styles.text}>
            ✅ Profile submitted successfully.
          </p>

          <p className={styles.subtext}>
            You can now use all platform features.
          </p>

          <button
            className={styles.cta}
            onClick={() => navigate("/dashboard/guest/profile")}
          >
            Edit profile
          </button>
        </>
      )}
    </div>
  );
}
