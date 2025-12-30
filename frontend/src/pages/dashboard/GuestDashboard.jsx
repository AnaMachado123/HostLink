import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./GuestDashboard.module.css";

export default function GuestDashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [guestExiste, setGuestExiste] = useState(false);

  useEffect(() => {
    async function checkGuest() {
      try {
        const res = await axios.get(
          "http://localhost:5000/guests/me",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data.exists) {
          setGuestExiste(true);
        }
      } catch {
        setGuestExiste(false);
      }
    }

    checkGuest();
  }, [token]);

  return (
    <div className={styles.card}>
      <h2>Guest Dashboard</h2>
      <p>Welcome to HostLink.</p>

      {!guestExiste && (
        <button
          className={styles.cta}
          onClick={() => navigate("/dashboard/guest/profile")}
        >
          Complete your profile
        </button>
      )}
    </div>
  );
}
