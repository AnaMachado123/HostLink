export default function Login() {
  return (
    <div style={styles.page}>
      <div style={styles.navbar}>
        <button style={styles.navItemActive}>Login</button>
        <button style={styles.navItem}>Register</button>
        <button style={styles.navItem}>Dashboard</button>
      </div>

      <div style={styles.centerContainer}>
        <h1 style={styles.title}>HostLink</h1>
        <p style={styles.subtitle}>Your stays, beautifully managed.</p>

        <div style={styles.loginBox}>
          <label style={styles.label}>Email</label>
          <input style={styles.input} placeholder="you@example.com" />

          <label style={styles.label}>Password</label>
          <input style={styles.input} type="password" placeholder="********" />

          <button style={styles.button}>Sign in</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    width: "100vw",
    height: "100vh",
    background: "linear-gradient(160deg, #F5FAFF 0%, #D7E9FF 100%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  navbar: {
    marginTop: "20px",
    background: "rgba(255,255,255,0.6)",
    backdropFilter: "blur(12px)",
    padding: "10px 20px",
    borderRadius: "40px",
    display: "flex",
    gap: "20px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
  },

  navItem: {
    background: "none",
    border: "none",
    padding: "10px 20px",
    color: "#6F7A86",
    borderRadius: "20px",
    cursor: "pointer",
  },

  navItemActive: {
    background: "#427EC3",
    border: "none",
    padding: "10px 20px",
    color: "white",
    borderRadius: "20px",
    cursor: "pointer",
  },

  centerContainer: {
    marginTop: "60px",
    textAlign: "center",
  },

  title: {
    fontSize: "42px",
    fontWeight: "700",
    color: "#1F2A36",
  },

  subtitle: {
    color: "#6F7A86",
    marginBottom: "40px",
  },

  loginBox: {
    width: "420px",
    padding: "40px",
    background: "rgba(255,255,255,0.55)",
    backdropFilter: "blur(12px)",
    borderRadius: "32px",
    boxShadow: "0 6px 24px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  label: {
    textAlign: "left",
    fontWeight: "500",
    color: "#1F2A36",
  },

  input: {
    height: "50px",
    padding: "12px 18px",
    borderRadius: "25px",
    border: "1px solid #E3E6EB",
    outline: "none",
    fontSize: "15px",
  },

  button: {
    marginTop: "10px",
    height: "52px",
    background: "#427EC3",
    color: "white",
    border: "none",
    borderRadius: "28px",
    fontSize: "18px",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 6px 20px rgba(66,126,195,0.35)",
  },
};
