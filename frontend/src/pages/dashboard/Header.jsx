import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./HostDashboard.module.css";

export default function Header({ role }) {
  const [displayName, setDisplayName] = useState("Account");

  useEffect(() => {
    async function fetchProfile() {
      try {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));
        if (!token) return;

        if (role === "empresa") {
          const res = await axios.get(
            "http://localhost:5000/empresas/me",
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );

          if (res.data?.nome) {
            setDisplayName(res.data.nome);
          } else {
            setDisplayName(user?.nome || "Service Company account");
          }
        }

        if (role === "proprietario") {
          setDisplayName(user?.nome || "Property Owner account");
        }

        if (role === "guest") {
          setDisplayName(user?.nome || "Guest account");
        }

      } catch (err) {
        console.error("Error loading header info", err);
        setDisplayName("Account");
      }
    }

    fetchProfile();
  }, [role]);

  return (
    <header className={styles.header}>
      <span className={styles.userBox}>{displayName}</span>
    </header>
  );
}
