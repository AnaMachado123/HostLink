import { NavLink, Outlet, useNavigate } from "react-router-dom";
import styles from "./AdminDashboard.module.css";
import logo from "../assets/icons/home.png";


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
        <div className={styles.top}>
          <div className={styles.logoBox}>
            <div className={styles.logoCircle}>
              <img src={logo} alt="HostLink" />
            </div>
            <span className={styles.logoText}>HostLink Admin</span>
          </div>

          <nav className={styles.nav}>
            <NavLink to="/admin" end className={({ isActive }) => (isActive ? styles.active : styles.link)}>
              Dashboard
            </NavLink>
           
            <NavLink to="/admin/users" className={({ isActive }) => (isActive ? styles.active : styles.link)}>
              Manage Users
            </NavLink>

            <NavLink to="/admin/invoices" className={({ isActive }) => (isActive ? styles.active : styles.link)}>
              Invoices
            </NavLink>

            {/*}
            <NavLink to="/admin/companies" className={({ isActive }) => (isActive ? styles.active : styles.link)}>
              Manage Companies
            </NavLink>
            <NavLink to="/admin/services" className={({ isActive }) => (isActive ? styles.active : styles.link)}>
              Manage Services
            </NavLink>
            */}
          </nav>
        </div>

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
