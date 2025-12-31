import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./CompleteOwnerProfile.module.css";
import completeIcon from "../../assets/icons/complete-profile.png";

export default function ProprietarioProfile() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const [loading, setLoading] = useState(true);
  const [existe, setExiste] = useState(false);
  const [proprietario, setProprietario] = useState(null);

  const [form, setForm] = useState({
    nome: user?.nome || "",
    email: user?.email || "", // ✅ FIX AQUI
    telefone: "",
    nif: ""
  });

  const [errors, setErrors] = useState({});

  // ===============================
  // CHECK OWNER PROFILE
  // ===============================
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await axios.get(
          "http://localhost:5000/proprietarios/me",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data.exists) {
          setExiste(true);
          setProprietario(res.data.proprietario);
        }
      } catch (err) {
        setExiste(false);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [token]);

  // ===============================
  // FORM HANDLERS
  // ===============================
  function handleChange(e) {
    const { name, value } = e.target;

    if ((name === "telefone" || name === "nif") && !/^\d*$/.test(value)) return;
    if ((name === "telefone" || name === "nif") && value.length > 9) return;

    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: "" });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const newErrors = {};
    if (form.telefone.length !== 9) newErrors.telefone = "Phone must have 9 digits";
    if (form.nif.length !== 9) newErrors.nif = "NIF must have 9 digits";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    await axios.post(
      "http://localhost:5000/proprietarios/profile",
      form,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // 🔁 igual à empresa
    window.location.reload();
  }

  if (loading) return null;

  // ===============================
  // READ-ONLY PROFILE (APÓS SUBMIT)
  // ===============================
  if (existe && proprietario) {
    return (
      <div className={styles.page}>
        <div className={styles.card}>
          <div className={styles.header}>
            <div className={styles.iconCircle}>
              <img src={completeIcon} alt="Profile" />
            </div>

            <div>
              <h1>Property owner profile</h1>
              <p>Your profile is under review.</p>
            </div>
          </div>

          <div className={styles.grid}>
            <div className={styles.full}>
              <label>Name</label>
              <input value={proprietario.nome} disabled />
            </div>

            <div className={styles.full}>
              <label>Email</label>
              <input value={proprietario.email} disabled />
            </div>

            <div>
              <label>Phone</label>
              <input value={proprietario.telefone} disabled />
            </div>

            <div>
              <label>NIF</label>
              <input value={proprietario.nif} disabled />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ===============================
  // FORM (PRIMEIRA VEZ)
  // ===============================
  return (
    <div className={styles.page}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <div className={styles.header}>
          <div className={styles.iconCircle}>
            <img src={completeIcon} alt="Complete profile" />
          </div>

          <div>
            <h1>Complete your property owner profile</h1>
            <p>Your account will be reviewed by an administrator.</p>
          </div>
        </div>

        <div className={styles.grid}>
          <div className={styles.full}>
            <label>Name</label>
            <input value={form.nome} disabled />
          </div>

          <div className={styles.full}>
            <label>Email</label>
            <input value={form.email} disabled />
          </div>

          <div>
            <label>Phone</label>
            <input
              name="telefone"
              value={form.telefone}
              onChange={handleChange}
              className={errors.telefone ? styles.inputError : ""}
            />
            {errors.telefone && <p className={styles.error}>{errors.telefone}</p>}
          </div>

          <div>
            <label>NIF</label>
            <input
              name="nif"
              value={form.nif}
              onChange={handleChange}
              className={errors.nif ? styles.inputError : ""}
            />
            {errors.nif && <p className={styles.error}>{errors.nif}</p>}
          </div>
        </div>

        <button className={styles.submit}>Submit profile</button>
      </form>
    </div>
  );
}
