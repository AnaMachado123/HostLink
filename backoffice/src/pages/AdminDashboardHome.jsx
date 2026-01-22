import { useEffect, useState } from "react";
import api from "../services/api";
import styles from "./AdminDashboardHome.module.css";


export default function AdminDashboardHome() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await api.get("/admin/dashboard");
      setStats(res.data);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div className={styles.page}>
      <h2>Admin Overview</h2>

      <div className={styles.grid}>
        <div className={styles.card}>
          <span className={styles.label}>Total users</span>
          <span className={styles.value}> {stats.total_users}</span>
        </div>

        <div className={styles.card}>
          <span className={styles.label}>Active companies</span>
          <span className={styles.value}> {stats.active_companies}</span>
        </div>

        <div className={styles.card}>
          <span className={styles.label}>Active owners</span>
          <span className={styles.value}> {stats.active_owners}</span>
        </div>

        <div className={styles.card}>
          <span className={styles.label}>Pending requests</span>
          <span className={styles.value}> {stats.pending_requests}</span>
        </div>

        <div className={styles.card}>
          <span className={styles.label}>Completed services</span>
          <span className={styles.value}> {stats.completed_services}</span>
        </div>
      </div>
    </div>
  );
}
