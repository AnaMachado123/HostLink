import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import api from "../../api";
import homeIcon from "../../assets/icons/home.png";
import styles from "./Register.module.css";

export default function Register() {
  const navigate = useNavigate();

  // fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [role, setRole]         = useState("");
  const [agree, setAgree]       = useState(false);

  // UI states
  const [errors, setErrors]     = useState({});
  const [loading, setLoading]   = useState(false);

  // ---------------------------------------
  // REAL-TIME VALIDATION
  // ---------------------------------------
  function validateField(field, value) {
    let msg = "";

    switch (field) {
      case "fullName":
        if (!value.trim()) msg = "Please enter your full name.";
        break;

      case "email":
        if (!value.trim()) msg = "Please enter your email.";
        else if (!value.includes("@")) msg = "Email must contain @.";
        break;

      case "password":
        if (value.length < 6) msg = "Password must be at least 6 characters.";
        break;

      case "confirm":
        if (value !== password) msg = "Passwords do not match.";
        break;

      case "role":
        if (!value) msg = "Please select your role.";
        break;

      case "agree":
        if (!value) msg = "You must accept the terms.";
        break;
    }

    setErrors((prev) => ({ ...prev, [field]: msg }));
  }

  // ---------------------------------------
  // SUBMIT
  // ---------------------------------------
  async function handleSubmit(e) {
    e.preventDefault();

    const newErr = {};

    if (!fullName.trim()) newErr.fullName = "Please enter your full name.";
    if (!email.trim()) newErr.email = "Please enter your email.";
    else if (!email.includes("@")) newErr.email = "Email must contain @.";

    if (password.length < 6)
      newErr.password = "Password must be at least 6 characters.";

    if (confirm !== password)
      newErr.confirm = "Passwords do not match.";

    if (!role) newErr.role = "Please select your role.";

    if (!agree) newErr.agree = "You must accept the terms.";

    setErrors(newErr);

    if (Object.keys(newErr).length > 0) return;

    try {
      setLoading(true);

      toast.info("Creating account...", { autoClose: 1200 });

      // ✅ ALTERAÇÃO PRINCIPAL:
      // enviamos APENAS a string do role
      await api.post("/register", {
        nome: fullName,
        username: email,
        password,
        role
      });

      toast.success("Account created successfully!", { autoClose: 1300 });

      setTimeout(() => {
        navigate("/", { state: { fromRegister: true } });
      }, 1500);

    } catch (err) {
      console.error(err);

      let msg = "Something went wrong.";
      if (err.response?.data?.error) msg = err.response.data.error;

      toast.error(msg, { autoClose: 2000 });

    } finally {
      setLoading(false);
    }
  }

  // helpers
  const nameValid     = fullName.trim() !== "" && !errors.fullName;
  const emailValid    = email.includes("@") && !errors.email;
  const passwordValid = password.length >= 6 && !errors.password;

  return (
    <div className={styles.page}>
      <ToastContainer position="top-right" newestOnTop />

      {/* LEFT SIDE */}
      <div className={styles.leftSide}>
        <div className={styles.iconCircle}>
          <img src={homeIcon} alt="Icon" className={styles.iconImg} />
        </div>

        <h1 className={styles.leftTitle}>Create account</h1>
        <div className={styles.leftSubtitle}>
          <p>Your stays, beautifully managed</p>
          <p>Your services, effortlessly organized!</p>
        </div>
      </div>

      {/* RIGHT SIDE FORM */}
      <div className={styles.rightSide}>
        <form className={styles.loginCard} onSubmit={handleSubmit}>
          <h2 className={styles.cardTitle}>Get started</h2>
          <p className={styles.cardSubtitle}>Create your HostLink account</p>

          {/* FULL NAME */}
          <label className={styles.label}>Full Name</label>
          <input
            className={`${styles.input} ${errors.fullName ? styles.inputError : ""}`}
            value={fullName}
            placeholder="Enter your full name"
            onChange={(e) => {
              setFullName(e.target.value);
              validateField("fullName", e.target.value);
            }}
          />
          {errors.fullName && <p className={styles.error}>{errors.fullName}</p>}

          {/* EMAIL */}
          <label className={styles.label}>Email</label>
          <input
            className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
            placeholder="example@email.com"
            disabled={!nameValid}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              validateField("email", e.target.value);
            }}
          />
          {errors.email && <p className={styles.error}>{errors.email}</p>}

          {/* PASSWORD */}
          <label className={styles.label}>Password</label>
          <input
            type="password"
            className={`${styles.input} ${errors.password ? styles.inputError : ""}`}
            disabled={!emailValid}
            placeholder="********"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              validateField("password", e.target.value);
            }}
          />
          {errors.password && <p className={styles.error}>{errors.password}</p>}

          {/* CONFIRM PASSWORD */}
          <label className={styles.label}>Confirm Password</label>
          <input
            type="password"
            className={`${styles.input} ${errors.confirm ? styles.inputError : ""}`}
            disabled={!passwordValid}
            placeholder="********"
            value={confirm}
            onChange={(e) => {
              setConfirm(e.target.value);
              validateField("confirm", e.target.value);
            }}
          />
          {errors.confirm && <p className={styles.error}>{errors.confirm}</p>}

          {/* ROLE */}
          <label className={styles.label}>Role</label>
          <select
            className={`${styles.input} ${errors.role ? styles.inputError : ""}`}
            value={role}
            disabled={!passwordValid}
            onChange={(e) => {
              setRole(e.target.value);
              validateField("role", e.target.value);
            }}
          >
            <option value="">Select your role</option>
            <option value="guest">Guest</option>
            <option value="proprietario">Property Owner</option>
            <option value="empresa">Service Company</option>
          </select>
          {errors.role && <p className={styles.error}>{errors.role}</p>}

          {/* TERMS */}
          <div className={styles.rememberRow}>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={agree}
              disabled={!role}
              onChange={() => {
                setAgree(!agree);
                validateField("agree", !agree);
              }}
            />
            <label className={styles.rememberLabel}>
              I agree to the Terms of Service and Privacy Policy
            </label>
          </div>
          {errors.agree && <p className={styles.error}>{errors.agree}</p>}

          {/* BUTTON */}
          <button className={styles.button} disabled={loading}>
            {loading ? "Creating..." : "Create account"}
          </button>

          <p className={styles.bottomText}>
            Already have an account?
            <Link to="/" className={styles.createLink}> Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
