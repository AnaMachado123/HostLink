import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import styles from "./AdminLogin.module.css";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", {
        username,
        password
      });

      // só admins entram no backoffice
      if (res.data.user.role !== "admin") {
        setError("Acesso restrito a administradores.");
        return;
      }

      // guarda token e user
      localStorage.setItem("adminToken", res.data.token);
      localStorage.setItem("adminUser", JSON.stringify(res.data.user));

      navigate("/admin/users");
    } catch (err) {
      setError("Credenciais inválidas ou erro no servidor.");
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h2 className={styles.title}>HostLink Admin</h2>
        <p className={styles.subtitle}>
          Restricted access to platform administration.
        </p>

        {error && <p className={styles.error}>{error}</p>}

        <form onSubmit={handleLogin}>
          <div className={styles.field}>
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              required
            />
          </div>

          <div className={styles.field}>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button className={styles.button} type="submit">
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
