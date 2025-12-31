import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./CompleteGuestProfile.module.css";
import completeIcon from "../../assets/icons/complete-profile.png";

export default function CompleteGuestProfile() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    nif: ""
  });

  const [errors, setErrors] = useState({});
  const [guestExiste, setGuestExiste] = useState(null); // 🔥 null = loading

  // --------------------------------------------------
  // LOAD DATA
  // --------------------------------------------------
  useEffect(() => {
    async function loadData() {
      try {
        // 🔹 USER BASE (sempre existe)
        const userRes = await axios.get(
          "http://localhost:5000/auth/me",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setForm((prev) => ({
          ...prev,
          nome: userRes.data.nome,
          email: userRes.data.email
        }));

        // 🔹 GUEST (pode ou não existir)
        const guestRes = await axios.get(
          "http://localhost:5000/guests/me",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (guestRes.data.exists && guestRes.data.guest) {
          setGuestExiste(true);
          setForm((prev) => ({
            ...prev,
            telefone: guestRes.data.guest.telefone || "",
            nif: guestRes.data.guest.nif || ""
          }));
        } else {
          setGuestExiste(false);
        }
      } catch (err) {
        console.error("Error loading guest profile", err);
        setGuestExiste(false);
      }
    }

    loadData();
  }, [token]);

  if (guestExiste === null) return null; // 🔥 evita flicker

  // --------------------------------------------------
  // INPUT
  // --------------------------------------------------
  function handleChange(e) {
    const { name, value } = e.target;

    if ((name === "telefone" || name === "nif") && !/^\d*$/.test(value)) return;
    if (name === "telefone" && value.length > 9) return;
    if (name === "nif" && value.length > 9) return;

    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  // --------------------------------------------------
  // SUBMIT (CREATE ou UPDATE)
  // --------------------------------------------------
  async function handleSubmit(e) {
    e.preventDefault();

    const newErrors = {};

    if (!form.telefone || form.telefone.length !== 9) {
      newErrors.telefone = "Phone must have 9 digits.";
    }

    if (form.nif && form.nif.length !== 9) {
      newErrors.nif = "NIF must have 9 digits.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    await axios.post(
      "http://localhost:5000/guests/profile",
      {
        nome: form.nome,
        email: form.email,
        telefone: form.telefone,
        nif: form.nif || null
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // 🔥 volta ao dashboard já com estado correto
    navigate("/dashboard/guest", { replace: true });
  }

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------
  return (
    <div className={styles.page}>
      <div className={styles.card}>

        {guestExiste && (
          <div className={styles.infoBox}>
            ✅ <strong>Profile completed</strong>
            <p>You can edit your personal information at any time.</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className={styles.header}>
            <div className={styles.iconCircle}>
              <img src={completeIcon} alt="Guest profile" />
            </div>
            <div>
              <h1>Guest Profile</h1>
              <p>
                {guestExiste
                  ? "This is your personal information."
                  : "Please complete your personal details."}
              </p>
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
              />
              {errors.telefone && (
                <div className={styles.error}>{errors.telefone}</div>
              )}
            </div>

            <div>
              <label>NIF (optional)</label>
              <input
                name="nif"
                value={form.nif}
                onChange={handleChange}
              />
              {errors.nif && (
                <div className={styles.error}>{errors.nif}</div>
              )}
            </div>
          </div>

          <button className={styles.submit}>
            {guestExiste ? "Save changes" : "Submit profile"}
          </button>
        </form>
      </div>
    </div>
  );
}
