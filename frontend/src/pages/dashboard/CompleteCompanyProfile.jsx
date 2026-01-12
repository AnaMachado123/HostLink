import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./CompleteCompanyProfile.module.css";
import completeIcon from "../../assets/icons/complete-profile.png";

export default function CompleteCompanyProfile() {
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
  const [submitting, setSubmitting] = useState(false);

  // ---------------------------------------------
  // LOAD DATA (CRIA vs VISUALIZA)
  // ---------------------------------------------
  useEffect(() => {
    async function loadData() {
      const token = localStorage.getItem("token");

      try {
        // 1️⃣ verificar se a empresa já existe
        const empresaRes = await axios.get(
          "http://localhost:5000/empresas/me",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (empresaRes.data.exists && empresaRes.data.empresa) {
          const empresa = empresaRes.data.empresa;

          setEmpresaExiste(true);

          setForm({
            nome: empresa.nome || "",
            email: empresa.email || "",
            telefone: empresa.telefone || "",
            nif: empresa.nif || "",
            rua: empresa.rua || "",
            nPorta: empresa.nporta || "",
            codPostal: empresa.cod_postal || "",
            location: empresa.location || ""
          });

          return;
        }

        // 2️⃣ se não existir empresa → preencher com dados do utilizador
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

    // read-only se já existir empresa
    if (empresaExiste) return;

    if (name === "telefone" && (!/^\d*$/.test(value) || value.length > 9)) return;
    if (name === "nif" && (!/^\d*$/.test(value) || value.length > 9)) return;
    if (name === "codPostal" && (!/^\d{0,4}(-\d{0,3})?$/.test(value))) return;
    if (name === "nPorta" && !/^\d*$/.test(value)) return;

    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  // ---------------------------------------------
  // SUBMIT (APENAS QUANDO NÃO EXISTE)
  // ---------------------------------------------
  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting || empresaExiste) return;

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
      setSubmitting(true);
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

      // flag para o dashboard
      localStorage.setItem("empresaProfileSubmitted", "true");

      // revalidação controlada
      setTimeout(() => {
        window.location.href = "/dashboard/empresa";
      }, 1200);

    } catch (err) {
      console.error(err);
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
              <div
                key={name}
                className={
                  ["nome", "nif", "codPostal", "location"].includes(name)
                    ? styles.full
                    : ""
                }
              >
                <label>{label}</label>
                <input
                  name={name}
                  value={form[name]}
                  disabled={empresaExiste}
                  onChange={handleChange}
                />
                {errors[name] && (
                  <p className={styles.error}>{errors[name]}</p>
                )}
              </div>
            ))}
          </div>

          {!empresaExiste && (
            <button className={styles.submit} disabled={submitting}>
              {submitting ? "Submitting..." : "Submit profile"}
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
