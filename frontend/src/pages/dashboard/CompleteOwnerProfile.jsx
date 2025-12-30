import { useState } from "react";
import styles from "./CompleteOwnerProfile.module.css";
import completeIcon from "../../assets/icons/complete-profile.png";

export default function CompleteOwnerProfile() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [form, setForm] = useState({
    nome: user?.nome || "",
    email: user?.username || "",
    telefone: "",
    nif: ""
  });

  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;

    // TELEFONE → só números, máx 9
    if (name === "telefone") {
      if (!/^\d*$/.test(value)) return;
      if (value.length > 9) return;
    }

    // NIF → só números, máx 9
    if (name === "nif") {
      if (!/^\d*$/.test(value)) return;
      if (value.length > 9) return;
    }

    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: "" });
  }

  function handleSubmit(e) {
    e.preventDefault();

    const newErrors = {};

    if (form.telefone.length !== 9) {
      newErrors.telefone = "Phone number must have 9 digits.";
    }

    if (form.nif.length !== 9) {
      newErrors.nif = "NIF must have 9 digits.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // 🚀 Aqui depois ligamos ao backend
    console.log("Owner profile submit:", form);
  }

  return (
    <div className={styles.page}>
      <form className={styles.card} onSubmit={handleSubmit}>
        {/* HEADER */}
        <div className={styles.header}>
          <div className={styles.iconCircle}>
            <img src={completeIcon} alt="Complete profile" />
          </div>

          <div>
            <h1>Complete your property owner profile</h1>
            <p>
              To proceed, please provide your personal details.<br />
              Your account will be reviewed by an administrator.
            </p>
          </div>
        </div>

        {/* FORM */}
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
              placeholder="912345678"
              className={errors.telefone ? styles.inputError : ""}
              inputMode="numeric"
            />
            {errors.telefone && (
              <p className={styles.error}>{errors.telefone}</p>
            )}
          </div>

          <div>
            <label>NIF</label>
            <input
              name="nif"
              value={form.nif}
              onChange={handleChange}
              placeholder="9-digit NIF"
              className={errors.nif ? styles.inputError : ""}
              inputMode="numeric"
            />
            {errors.nif && <p className={styles.error}>{errors.nif}</p>}
          </div>
        </div>

        <button className={styles.submit}>Submit profile</button>
      </form>
    </div>
  );
}
