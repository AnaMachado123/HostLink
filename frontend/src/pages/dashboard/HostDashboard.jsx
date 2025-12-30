import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";
import styles from "./HostDashboard.module.css";
import logo from "../../assets/icons/home.png";

export default function HostDashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;
  const token = localStorage.getItem("token");

  const [empresaExiste, setEmpresaExiste] = useState(false);
  const [guestExiste, setGuestExiste] = useState(false);

  // ---------------------------------------------
  // CHECK SETUP (empresa / guest)
  // ---------------------------------------------
  useEffect(() => {
    async function checkProfile() {
      try {
        if (role === "empresa") {
          const res = await axios.get(
            "http://localhost:5000/empresas/me",
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setEmpresaExiste(res.data.exists === true);
        }

        if (role === "guest") {
          const res = await axios.get(
            "http://localhost:5000/guests/me",
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setGuestExiste(res.data.exists === true);
        }
      } catch (err) {
        console.error("Erro ao verificar profile", err);
      }
    }

    checkProfile();
  }, [role, token]);

  // ---------------------------------------------
  // LOGOUT
  // ---------------------------------------------
  function handleLogout() {
    localStorage.clear();
    navigate("/");
  }

  // ---------------------------------------------
  // RENDER
  // ---------------------------------------------
  return (
    <div className={styles.page}>
      {/* SIDEBAR */}
      <aside className={styles.sidebar}>
        <div className={styles.top}>
          {/* LOGO */}
          <div className={styles.logoBox}>
            <div className={styles.logoCircle}>
              <img src={logo} alt="HostLink" />
            </div>
            <span className={styles.logoText}>HostLink</span>
          </div>

          {/* NAV */}
          <nav className={styles.nav}>
            {/* DASHBOARD */}
            <NavLink
              to={`/dashboard/${role}`}
              className={({ isActive }) =>
                isActive ? styles.active : styles.link
              }
            >
              Dashboard
            </NavLink>

            {/* PROFILE */}
            {role === "empresa" && (
              <div className={styles.navItem}>
                <NavLink
                  to="/dashboard/empresa/profile"
                  className={({ isActive }) =>
                    isActive ? styles.active : styles.link
                  }
                >
                  Profile
                </NavLink>

                {!empresaExiste && (
                  <span className={styles.profileBadge}>SETUP</span>
                )}
              </div>
            )}

            {role === "guest" && (
              <div className={styles.navItem}>
                <NavLink
                  to="/dashboard/guest/profile"
                  className={({ isActive }) =>
                    isActive ? styles.active : styles.link
                  }
                >
                  Profile
                </NavLink>

                {!guestExiste && (
                  <span className={styles.profileBadge}>SETUP</span>
                )}
              </div>
            )}

            {/* REVIEWS — guest */}
            {role === "guest" && (
              <NavLink
                to="/dashboard/guest/reviews"
                className={({ isActive }) =>
                  isActive ? styles.active : styles.link
                }
              >
                Reviews
              </NavLink>
            )}

            {/* REQUESTS — bloqueado por agora */}
            {(role === "empresa" || role === "proprietario") && (
              <span className={styles.linkDisabled}>Requests</span>
            )}
          </nav>
        </div>

        {/* LOGOUT */}
        <button className={styles.logout} onClick={handleLogout}>
          Logout
        </button>
      </aside>

      {/* MAIN */}
      <div className={styles.main}>
        <Header role={role} />
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
