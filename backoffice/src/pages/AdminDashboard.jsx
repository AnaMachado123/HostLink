import { NavLink, Outlet, useNavigate } from "react-router-dom";
import styles from "./AdminDashboard.module.css";

export default function AdminDashboard() {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate("/login");
  }

  return (
    <div className={styles.page}>
      <aside className={styles.sidebar}>
        <h2 className={styles.title}>HostLink Admin</h2>

        <nav className={styles.nav}>
          <NavLink to="/admin/users" className={({ isActive }) => (isActive ? styles.active : styles.link)}>
            Manage Users
          </NavLink>
          <NavLink to="/admin/companies" className={({ isActive }) => (isActive ? styles.active : styles.link)}>
            Manage Companies
          </NavLink>
          <NavLink to="/admin/services" className={({ isActive }) => (isActive ? styles.active : styles.link)}>
            Manage Services
          </NavLink>
        </nav>

        <button className={styles.logout} onClick={logout}>
          Logout
        </button>
      </aside>

      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  );
}
