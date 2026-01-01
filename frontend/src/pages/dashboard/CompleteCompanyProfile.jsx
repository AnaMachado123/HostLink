import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./CompleteCompanyProfile.module.css";
import completeIcon from "../../assets/icons/complete-profile.png";

export default function CompleteCompanyProfile() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    nif: "",
    rua: "",
    nPorta: "",
    codPostal: "",
    location: ""
  });

  const [errors, setErrors] = useState({});
  const [empresaExiste, setEmpresaExiste] = useState(false);
  const [status, setStatus] = useState(null); // pending | approved | rejected

  // ---------------------------------------------
  // LOAD DATA
  // ---------------------------------------------
 useEffect(() => {
  async function loadData() {
    const token = localStorage.getItem("token");

    try {
      // 1️⃣ tenta empresa
      const empresaRes = await axios.get(
        "http://localhost:5000/empresas/me",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (empresaRes.data.exists && empresaRes.data.empresa) {
        setEmpresaExiste(true);
        setForm({
          nome: empresaRes.data.empresa.nome,
          email: empresaRes.data.empresa.email,
          telefone: empresaRes.data.empresa.telefone || "",
          nif: empresaRes.data.empresa.nif || "",
          rua: empresaRes.data.empresa.rua || "",
          nPorta: empresaRes.data.empresa.nporta || "",
          codPostal: empresaRes.data.empresa.cod_postal || "",
          location: empresaRes.data.empresa.location || ""
        });
        return;
      }

      // 2️⃣ empresa não existe → usa auth/me
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
      console.error("Erro ao carregar company profile", err);
    }
  }

  loadData();
}, []);

  // ---------------------------------------------
  // HANDLE INPUT
  // ---------------------------------------------
  function handleChange(e) {
    const { name, value } = e.target;

    if (empresaExiste && status !== "approved") return;

    if (name === "telefone" && (!/^\d*$/.test(value) || value.length > 9)) return;
    if (name === "nif" && (!/^\d*$/.test(value) || value.length > 9)) return;
    if (name === "codPostal" && (!/^\d{0,4}(-\d{0,3})?$/.test(value))) return;
    if (name === "nPorta" && !/^\d*$/.test(value)) return;

    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  // ---------------------------------------------
  // SUBMIT
  // ---------------------------------------------
  async function handleSubmit(e) {
    e.preventDefault();

    const newErrors = {};

    if (!form.nome) newErrors.nome = "Company name is required.";
    if (!form.email) newErrors.email = "Email is required.";
    if (form.telefone.length !== 9) newErrors.telefone = "Phone must have 9 digits.";
    if (form.nif.length !== 9) newErrors.nif = "NIF must have 9 digits.";
    if (!form.rua.trim()) newErrors.rua = "Street is required.";
    if (!form.nPorta) newErrors.nPorta = "Door number is required.";
    if (!/^\d{4}-\d{3}$/.test(form.codPostal)) {
      newErrors.codPostal = "Postal code must be in format 1234-567.";
    }
    if (!form.location.trim()) newErrors.location = "Location is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/empresas/profile",
        {
          nome_empresa: form.nome,
          email: form.email,
          telefone: form.telefone,
          nif: form.nif,
          rua: form.rua,
          numero: Number(form.nPorta),
          codigo_postal: form.codPostal,
          location: form.location
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      navigate("/dashboard/empresa");
    } catch (err) {
      console.error(err);
    }
  }

  const readOnly = empresaExiste && status !== "approved";

  // ---------------------------------------------
  // RENDER
  // ---------------------------------------------
  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>

        {empresaExiste && status === "pending" && (
          <div className={styles.infoBox}>
            ⏳ <strong>Profile submitted</strong>
            <p>Your company profile is under review.</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className={styles.header}>
            <div className={styles.iconCircle}>
              <img src={completeIcon} alt="Company profile" />
            </div>
            <div>
              <h1>Company Profile</h1>
              <p>
                {empresaExiste
                  ? "This is your submitted company information."
                  : "Please provide your company details."}
              </p>
            </div>
          </div>

          <div className={styles.grid}>
            {[
              ["Company Name", "nome"],
              ["Email", "email"],
              ["Phone", "telefone"],
              ["NIF", "nif"],
              ["Street", "rua"],
              ["Number", "nPorta"],
              ["Postal Code", "codPostal"],
              ["Location", "location"]
            ].map(([label, name]) => (
              <div key={name} className={name === "nome" || name === "nif" || name === "codPostal" || name === "location" ? styles.full : ""}>
                <label>{label}</label>
                <input
                  name={name}
                  value={form[name]}
                  disabled={readOnly}
                  onChange={handleChange}
                />
                {errors[name] && <p className={styles.error}>{errors[name]}</p>}
              </div>
            ))}
          </div>

          {!empresaExiste && (
            <button className={styles.submit}>Submit profile</button>
          )}
        </form>
      </div>
    </div>
  );
}
