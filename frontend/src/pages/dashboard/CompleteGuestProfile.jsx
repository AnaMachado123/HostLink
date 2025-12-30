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
  const [guestExiste, setGuestExiste] = useState(false);

  // ------------------------------------
  // LOAD DATA
  // ------------------------------------
  useEffect(() => {
    async function loadData() {
      try {
        // auth user (nome + email NUNCA nulos)
        const userRes = await axios.get(
          "http://localhost:5000/auth/me",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setForm((prev) => ({
          ...prev,
          nome: userRes.data.nome || userRes.data.username || "",
          email: userRes.data.email || ""
        }));

        // guest (se existir)
        const guestRes = await axios.get(
          "http://localhost:5000/guests/me",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (guestRes.data.exists) {
          setGuestExiste(true);
          setForm((prev) => ({
            ...prev,
            telefone: guestRes.data.guest.telefone || "",
            nif: guestRes.data.guest.nif || ""
          }));
        }
      } catch {
        // guest ainda não existe → normal
      }
    }

    loadData();
  }, [token]);

  // ------------------------------------
  // INPUT
  // ------------------------------------
  function handleChange(e) {
    const { name, value } = e.target;
    if ((name === "telefone" || name === "nif") && !/^\d*$/.test(value)) return;
    if ((name === "telefone" || name === "nif") && value.length > 9) return;

    setForm((prev) => ({ ...prev, [name]: value }));
  }

  // ------------------------------------
  // SUBMIT (SÓ SE NÃO EXISTIR)
  // ------------------------------------
  async function handleSubmit(e) {
    e.preventDefault();
    if (guestExiste) return;

    if (!form.telefone || form.telefone.length !== 9) {
      setErrors({ telefone: "Phone must have 9 digits." });
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

    navigate("/dashboard/guest");
  }

  // ------------------------------------
  // RENDER
  // ------------------------------------
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        {guestExiste && (
          <div className={styles.infoBox}>
            ✅ <strong>Profile completed</strong>
            <p>You can edit this information later.</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className={styles.header}>
            <div className={styles.iconCircle}>
              <img src={completeIcon} alt="" />
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
                disabled={guestExiste}
              />
            </div>

            <div>
              <label>NIF (optional)</label>
              <input
                name="nif"
                value={form.nif}
                onChange={handleChange}
                disabled={guestExiste}
              />
            </div>
          </div>

          {!guestExiste && (
            <button className={styles.submit}>Submit profile</button>
          )}
        </form>
      </div>
    </div>
  );
}
