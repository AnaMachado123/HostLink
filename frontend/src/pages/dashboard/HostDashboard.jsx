import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Header from "./Header";
import styles from "./HostDashboard.module.css";
import logo from "../../assets/icons/home.png";

export default function HostDashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;
  const token = localStorage.getItem("token");

  // 🔑 FLAG lida UMA vez
  const profileJustSubmittedRef = useRef(
    localStorage.getItem("empresaProfileSubmitted") === "true"
  );

  // evita toast duplicado
  const toastShownRef = useRef(false);

  // ================= EMPRESA =================
  // 🔥 estado inicial já assume submit
  const [empresaExiste, setEmpresaExiste] = useState(
    profileJustSubmittedRef.current
  );

  const [empresaStatus, setEmpresaStatus] = useState(
    profileJustSubmittedRef.current ? "PENDING" : null
  );

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
        if (role === "empresa") {
          const res = await axios.get(
            "http://localhost:5000/empresas/me",
            { headers: { Authorization: `Bearer ${token}` } }
          );

          // ✅ FLAG TEM PRIORIDADE SOBRE O BACKEND
          if (profileJustSubmittedRef.current) {
            setEmpresaExiste(true);
            setEmpresaStatus("PENDING");
          } 
          else if (res.data.exists && res.data.empresa) {
            setEmpresaExiste(true);
            setEmpresaStatus(res.data.empresa.status);
          } 
          else {
            setEmpresaExiste(false);
            setEmpresaStatus(null);
          }

          // 🔔 toast UMA única vez
          if (
            profileJustSubmittedRef.current &&
            !toastShownRef.current
          ) {
            toast.info(
              "Profile submitted successfully. Your account is under review."
            );
            toastShownRef.current = true;

            // limpa flag depois do primeiro render estável
            localStorage.removeItem("empresaProfileSubmitted");
            profileJustSubmittedRef.current = false;
          }
        }

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

  // sidebar estável (sem glitch)
  if (loadingProfile) {
    return (
      <div className={styles.page}>
        <aside className={styles.sidebar} />
        <div className={styles.main} />
      </div>
    );
  }

  // ---------------------------------------------
  // RENDER
  // ---------------------------------------------
  return (
    <div className={styles.page}>
      <aside className={styles.sidebar}>
        <div className={styles.top}>
          <div className={styles.logoBox}>
            <div className={styles.logoCircle}>
              <img src={logo} alt="HostLink" />
            </div>
            <span className={styles.logoText}>HostLink</span>
          </div>

          <nav className={styles.nav}>
            <NavLink
              to={`/dashboard/${role}`}
              className={({ isActive }) =>
                isActive ? styles.active : styles.link
              }
            >
              Dashboard
            </NavLink>

            {role === "empresa" && (
              <>
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

                <NavLink
                  to="/dashboard/empresa/services"
                  className={empresaExiste ? styles.link : styles.linkDisabled}
                >
                  Services
                </NavLink>

                <NavLink
                  to="/dashboard/empresa/requests"
                  className={empresaExiste ? styles.link : styles.linkDisabled}
                >
                  Requests
                </NavLink>
              </>
            )}

            {role === "proprietario" && (
              <>
                <div className={styles.navItem}>
                  <NavLink
                    to="/dashboard/proprietario/profile"
                    className={({ isActive }) =>
                      isActive ? styles.active : styles.link
                    }
                  >
                    Profile
                  </NavLink>
                </div>

                <NavLink
                  to="/dashboard/proprietario/properties"
                  className={
                    proprietarioExiste ? styles.link : styles.linkDisabled
                  }
                >
                  Properties
                </NavLink>

                <NavLink
                  to="/dashboard/proprietario/services"
                  className={
                    proprietarioExiste ? styles.link : styles.linkDisabled
                  }
                >
                  Requests
                </NavLink>
              </>
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
