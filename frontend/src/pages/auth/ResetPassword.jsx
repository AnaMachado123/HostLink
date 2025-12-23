import { useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import lockIcon from "../../assets/icons/lock.png";
import styles from "./ResetPassword.module.css";

export default function ResetPassword() {
  const [email, setEmail] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email.");
      return;
    }

    toast.info("Sending reset link");

    setTimeout(() => {
      toast.success("Reset link sent successfully!");
    }, 800);
  }

  return (
    <div className={styles.page}>
      <ToastContainer position="top-right" newestOnTop />

      <form className={styles.card} onSubmit={handleSubmit}>
        
        {/* BADGE */}
        <div className={styles.iconCircle}>
          <img src={lockIcon} alt="Lock" className={styles.lockIcon} />
        </div>

        <h2 className={styles.title}>Forgot your password?</h2>
        <p className={styles.subtitle}>
          Enter your email to receive reset instructions.
        </p>

        <label className={styles.label}>Email</label>
        <input
          type="email"
          className={styles.input}
          placeholder="example@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button className={styles.button}>Send reset link</button>

        <p className={styles.backText}>
          Remembered your password?
          <Link to="/" className={styles.backLink}> Sign in</Link>
        </p>

      </form>
    </div>
  );
}
