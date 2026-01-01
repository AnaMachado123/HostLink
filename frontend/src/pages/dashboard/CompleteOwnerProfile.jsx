import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./CompleteOwnerProfile.module.css";
import completeIcon from "../../assets/icons/complete-profile.png";

export default function CompleteOwnerProfile() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    nif: ""
  });

  const [errors, setErrors] = useState({});
  const [ownerExiste, setOwnerExiste] = useState(false);
  const [status, setStatus] = useState(null); // PENDING | ACTIVE | REJECTED

  // ---------------------------------------------
  // LOAD DATA
  // ---------------------------------------------
  useEffect(() => {
    async function loadData() {
      try {
        // 1️⃣ tenta proprietário
        const res = await axios.get(
          "http://localhost:5000/proprietarios/me",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data.exists && res.data.proprietario) {
          setOwnerExiste(true);
          setStatus(res.data.proprietario.status);

          setForm({
            nome: res.data.proprietario.nome,
            email: res.data.proprietario.email,
            telefone: res.data.proprietario.telefone || "",
            nif: res.data.proprietario.nif || ""
          });
          return;
        }

        // 2️⃣ não existe → usa auth/me
        const userRes = await axios.get(
          "http://localhost:5000/auth/me",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setForm((prev) => ({
          ...prev,
          nome: userRes.data.nome,
          email: userRes.data.email
        }));

      } catch (err) {
        console.error("Erro ao carregar owner profile", err);
      }
    }

    loadData();
  }, [token]);

  // ---------------------------------------------
  // HANDLE INPUT
  // ---------------------------------------------
  function handleChange(e) {
    const { name, value } = e.target;

    // 🔒 bloqueia se existir e não estiver REJECTED
    if (ownerExiste && status !== "REJECTED") return;

    if ((name === "telefone" || name === "nif") &&
        (!/^\d*$/.test(value) || value.length > 9)) return;

    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  // ---------------------------------------------
  // SUBMIT
  // ---------------------------------------------
  async function handleSubmit(e) {
    e.preventDefault();

    const newErrors = {};
    if (!form.nome) newErrors.nome = "Name is required.";
    if (!form.email) newErrors.email = "Email is required.";
    if (form.telefone.length !== 9) newErrors.telefone = "Phone must have 9 digits.";
    if (form.nif.length !== 9) newErrors.nif = "NIF must have 9 digits.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/proprietarios/profile",
        {
          nome: form.nome,
          email: form.email,
          telefone: form.telefone,
          nif: form.nif
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      navigate("/dashboard/proprietario");
    } catch (err) {
      console.error(err);
    }
  }

  const readOnly = ownerExiste && status !== "REJECTED";

  // ---------------------------------------------
  // RENDER
  // ---------------------------------------------
  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>

        {ownerExiste && status === "PENDING" && (
          <div className={styles.infoBox}>
            ⏳ <strong>Profile submitted</strong>
            <p>Your property owner profile is under review.</p>
          </div>
        )}

        {ownerExiste && status === "REJECTED" && (
          <div className={styles.infoBoxError}>
            ❌ <strong>Profile rejected</strong>
            <p>You may update your information and resubmit.</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className={styles.header}>
            <div className={styles.iconCircle}>
              <img src={completeIcon} alt="Owner profile" />
            </div>

            <div>
              <h1>Property Owner Profile</h1>
              <p>
                {ownerExiste
                  ? "This is your submitted profile information."
                  : "Please provide your property owner details."}
              </p>
            </div>
          </div>

          <div className={styles.grid}>
            {[
              ["Name", "nome"],
              ["Email", "email"],
              ["Phone", "telefone"],
              ["NIF", "nif"]
            ].map(([label, name]) => (
              <div key={name} className={styles.full}>
                <label>{label}</label>
                <input
                  name={name}
                  value={form[name]}
                  disabled={readOnly}
                  onChange={handleChange}
                />
                {errors[name] && (
                  <p className={styles.error}>{errors[name]}</p>
                )}
              </div>
            ))}
          </div>

          {(!ownerExiste || status === "REJECTED") && (
            <button className={styles.submit}>
              Submit profile
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
