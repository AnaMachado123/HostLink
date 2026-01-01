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
  const userStatus = user?.status;
  const token = localStorage.getItem("token");

  // ================= EMPRESA (NÃO TOCAR) =================
  const [empresaExiste, setEmpresaExiste] = useState(false);
  const [empresaStatus, setEmpresaStatus] = useState(null);

  // ================= PROPRIETÁRIO =================
  const [proprietarioExiste, setProprietarioExiste] = useState(false);
  const [proprietarioStatus, setProprietarioStatus] = useState(null);

  const [loadingProfile, setLoadingProfile] = useState(true);

  // ---------------------------------------------
  // CHECK PROFILE
  // ---------------------------------------------
  useEffect(() => {
    async function checkProfiles() {
      try {
        // ---------- EMPRESA (intacto) ----------
        if (role === "empresa") {
          const res = await axios.get(
            "http://localhost:5000/empresas/me",
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (res.data.exists && res.data.empresa) {
            setEmpresaExiste(true);
            setEmpresaStatus(res.data.empresa.status);
          }
        }

        // ---------- PROPRIETÁRIO ----------
        if (role === "proprietario") {
          const res = await axios.get(
            "http://localhost:5000/proprietarios/me",
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (res.data.exists && res.data.proprietario) {
            setProprietarioExiste(true);
            setProprietarioStatus(res.data.proprietario.status);
          }
        }

      } catch (err) {
        console.error("Erro ao verificar profiles", err);
      } finally {
        setLoadingProfile(false);
      }
    }

    checkProfiles();
  }, [role, token]);

  // ---------------------------------------------
  // LOGOUT
  // ---------------------------------------------
  function handleLogout() {
    localStorage.clear();
    navigate("/");
  }

  if (loadingProfile) return null;

  // ---------------------------------------------
  // RENDER
  // ---------------------------------------------
  return (
    <div className={styles.page}>
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

            {/* ================= GUEST (INTACTO) ================= */}
            {role === "guest" && (
              <>
                <NavLink
                  to="/dashboard/guest/profile"
                  className={({ isActive }) =>
                    isActive ? styles.active : styles.link
                  }
                >
                  Profile
                </NavLink>

                <NavLink
                  to="/dashboard/guest/reviews"
                  className={({ isActive }) =>
                    isActive ? styles.active : styles.link
                  }
                >
                  Reviews
                </NavLink>
              </>
            )}

            {/* ================= EMPRESA (INTACTO) ================= */}
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

            {role === "empresa" && (
              empresaExiste && userStatus === "ACTIVE" ? (
                <NavLink
                  to="/dashboard/empresa/services"
                  className={({ isActive }) =>
                    isActive ? styles.active : styles.link
                  }
                >
                  Services
                </NavLink>
              ) : (
                <span className={styles.linkDisabled}>Services</span>
              )
            )}

            {/* ================= PROPRIETÁRIO ================= */}
            {role === "proprietario" && (
              <div className={styles.navItem}>
                <NavLink
                  to="/dashboard/proprietario/profile"
                  className={({ isActive }) =>
                    isActive ? styles.active : styles.link
                  }
                >
                  Profile
                </NavLink>

                {!proprietarioExiste && (
                  <span className={styles.profileBadge}>SETUP</span>
                )}
              </div>
            )}

            {role === "proprietario" && (
              proprietarioExiste && userStatus === "ACTIVE" ? (
                <NavLink
                  to="/dashboard/proprietario/properties"
                  className={({ isActive }) =>
                    isActive ? styles.active : styles.link
                  }
                >
                  Properties
                </NavLink>
              ) : (
                <span className={styles.linkDisabled}>Properties</span>
              )
            )}

            {/* REQUESTS */}
            {(role === "empresa" || role === "proprietario") && (
              <span className={styles.linkDisabled}>Requests</span>
            )}
          </nav>
        </div>

        <button className={styles.logout} onClick={handleLogout}>
          Logout
        </button>
      </aside>

      <div className={styles.main}>
        <Header role={role} />
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
