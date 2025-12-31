import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import api from "../../api";
import homeIcon from "../../assets/icons/home.png";
import styles from "./Login.module.css";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const fromRegister = location.state?.fromRegister === true;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const emailValid = email && emailError === "";

  function handleEmailChange(e) {
    const value = e.target.value;
    setEmail(value);

    if (!value.trim()) setEmailError("Please enter your email.");
    else if (!value.includes("@")) setEmailError("Email must contain @.");
    else setEmailError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();

    let valid = true;

    if (!email.trim()) {
      setEmailError("Please enter your email.");
      valid = false;
    } else if (!email.includes("@")) {
      setEmailError("Email must contain @.");
      valid = false;
    }

    if (!password.trim()) {
      setPasswordError("Please enter your password.");
      valid = false;
    }

    if (!valid) return;

    try {
      toast.info("Checking credentials...", { autoClose: 1000 });

      const res = await api.post("/login", {
        username: email,
        password,
      });

      toast.success("Welcome!", { autoClose: 1200 });

      const { token, user } = res.data;

// 🔒 limpa lixo antigo (CRÍTICO)
localStorage.clear();

// guarda sessão base
localStorage.setItem("token", token);
localStorage.setItem(
  "user",
  JSON.stringify({
    id_utilizador: user.id_utilizador,
    role: user.role,
    nome: user.nome,     // ✅ necessário para header inicial
    email: user.email    // ✅ necessário para prefill
  })
);

// redirect por role
setTimeout(() => {
  navigate(`/dashboard/${user.role}`);
}, 800);


    } catch (err) {
      console.error(err);

      let msg = "Invalid email or password.";
      if (err.response?.data?.error) msg = err.response.data.error;

      toast.error(msg, { autoClose: 1800 });
    }
  }

  return (
    <div className={styles.page}>
      <ToastContainer position="top-right" newestOnTop />

      <div className={styles.leftSide}>
        <div className={styles.iconCircle}>
          <img src={homeIcon} className={styles.iconImg} alt="logo" />
        </div>
        <h1 className={styles.leftTitle}>HostLink</h1>
        <p className={styles.leftSubtitle}>
          Your stays, beautifully managed <br />
          Your services, effortlessly organized
        </p>
      </div>

      <div className={styles.rightSide}>
        <form className={styles.loginCard} onSubmit={handleSubmit}>
          <h2 className={styles.cardTitle}>
            {fromRegister ? "Welcome!" : "Welcome Back!"}
          </h2>

          <p className={styles.cardSubtitle}>
            {fromRegister
              ? "Sign in to start using HostLink"
              : "Sign in to HostLink"}
          </p>

          <label className={styles.label}>Email</label>
          <input
            className={`${styles.input} ${
              emailError ? styles.inputError : ""
            }`}
            placeholder="example@email.com"
            value={email}
            onChange={handleEmailChange}
          />
          {emailError && <p className={styles.error}>{emailError}</p>}

          <label className={styles.label}>Password</label>
          <input
            type="password"
            disabled={!emailValid}
            className={`${styles.input} ${
              passwordError ? styles.inputError : ""
            }`}
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {!emailValid && email && (
            <p className={styles.tip}>Enter a valid email first</p>
          )}

          {passwordError && <p className={styles.error}>{passwordError}</p>}

          <div className={styles.forgotWrapper}>
            <a className={styles.forgot} href="/forgot-password">
              Forgot password?
            </a>
          </div>

          <button type="submit" className={styles.button}>
            Sign in
          </button>

          <p className={styles.bottomText}>
            Don’t have an account?{" "}
            <Link to="/register" className={styles.createLink}>
              Create one
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
