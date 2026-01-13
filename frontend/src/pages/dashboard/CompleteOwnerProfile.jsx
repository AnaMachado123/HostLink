import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./CompleteOwnerProfile.module.css";
import completeIcon from "../../assets/icons/complete-profile.png";

export default function CompleteOwnerProfile() {
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    nif: ""
  });

  const [errors, setErrors] = useState({});
  const [ownerExiste, setOwnerExiste] = useState(false);
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // ---------------------------------------------
  // LOAD DATA (igual à empresa)
  // ---------------------------------------------
  useEffect(() => {
    async function loadData() {
      try {
        const res = await axios.get(
          "http://localhost:5000/proprietarios/me",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data.exists && res.data.proprietario) {
          const owner = res.data.proprietario;

          setOwnerExiste(true);
          setStatus(owner.status);

          setForm({
            nome: owner.nome || "",
            email: owner.email || "",
            telefone: owner.telefone || "",
            nif: owner.nif || ""
          });
          return;
        }

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

    if (ownerExiste && status !== "REJECTED") return;

    if (
      (name === "telefone" || name === "nif") &&
      (!/^\d*$/.test(value) || value.length > 9)
    ) return;

    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  // ---------------------------------------------
  // SUBMIT (IGUAL À EMPRESA)
  // ---------------------------------------------
  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting || ownerExiste) return;

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
      setSubmitting(true);

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

      // 🔑 flag igual à empresa
      localStorage.setItem("ownerProfileSubmitted", "true");

      // 🔁 reload controlado (igual)
      setTimeout(() => {
        window.location.href = "/dashboard/proprietario";
      }, 1200);

    } catch (err) {
      console.error("Submit owner profile error:", err);
      setSubmitting(false);
    }
  }

  // ---------------------------------------------
  // RENDER
  // ---------------------------------------------
  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
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
                  disabled={ownerExiste && status !== "REJECTED"}
                  onChange={handleChange}
                />
                {errors[name] && (
                  <p className={styles.error}>{errors[name]}</p>
                )}
              </div>
            ))}
          </div>

          {!ownerExiste && (
            <button className={styles.submit} disabled={submitting}>
              {submitting ? "Submitting..." : "Submit profile"}
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
