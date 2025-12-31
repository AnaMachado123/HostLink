import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./HostDashboard.module.css";

export default function Header({ role }) {
  const [displayName, setDisplayName] = useState("Account");

  useEffect(() => {
    async function loadHeader() {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        // 🔹 SEMPRE buscar o utilizador base
        const authRes = await axios.get("http://localhost:5000/auth/me", {
          headers: { Authorization: `Bearer ${token}` }
        });

        let name = authRes.data.nome;

        // 🔹 empresa → tenta nome da empresa
        if (role === "empresa") {
          const empresaRes = await axios.get(
            "http://localhost:5000/empresas/me",
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (empresaRes.data?.empresa?.nome) {
            name = empresaRes.data.empresa.nome;
          }
        }

        setDisplayName(name);

      } catch (err) {
        console.error("Header load error", err);
        setDisplayName("Account");
      }
    }

    loadHeader();
  }, [role]);

  return (
    <header className={styles.header}>
      <span className={styles.userBox}>{displayName}</span>
    </header>
  );
}
