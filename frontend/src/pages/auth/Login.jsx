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

      // ✅ CORREÇÃO AQUI (endpoint)
      const res = await api.post("/login", {
        username: email,
        password,
      });

      toast.success("Welcome!", { autoClose: 1200 });

      const { token, user } = res.data;

      // guardar sessão
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // redirecionar por role
      setTimeout(() => {
        if (user.role === "proprietario") {
          navigate("/dashboard/proprietario");
        } else if (user.role === "empresa") {
          navigate("/dashboard/empresa");
        } else if (user.role === "guest") {
          navigate("/dashboard/guest");
        } else {
          navigate("/");
        }
      }, 1300);

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

      {/* LEFT SIDE */}
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

      {/* RIGHT SIDE */}
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

          {/* EMAIL */}
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

          {/* PASSWORD */}
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

          {/* FORGOT PASSWORD */}
          <div className={styles.forgotWrapper}>
            <a className={styles.forgot} href="/forgot-password">
              Forgot password?
            </a>
          </div>

          {/* BUTTON */}
          <button type="submit" className={styles.button}>
            Sign in
          </button>

          {/* REGISTER */}
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
