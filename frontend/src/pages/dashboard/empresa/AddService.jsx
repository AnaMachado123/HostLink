import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./AddService.module.css";

export default function AddService() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const [form, setForm] = useState({
    nome: "",
    descricao: "",
    valor: "",
    tipoServico: ""
  });

  const [tipos, setTipos] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ---------------------------------------------
  // LOAD SERVICE TYPES
  // ---------------------------------------------
  useEffect(() => {
    async function loadTipos() {
      // proteção
      if (user?.role !== "empresa" || user?.status !== "ACTIVE") {
        navigate("/dashboard/empresa");
        return;
      }

      try {
        const res = await axios.get(
          "http://localhost:5000/servicos/tipos",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setTipos(res.data || []);
      } catch (err) {
        console.error(err);
      }
    }

    loadTipos();
  }, [navigate, token, user]);

  // ---------------------------------------------
  // INPUT
  // ---------------------------------------------
  function handleChange(e) {
    const { name, value } = e.target;

    if (name === "valor" && !/^\d*\.?\d*$/.test(value)) return;

    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  // ---------------------------------------------
  // SUBMIT
  // ---------------------------------------------
  async function handleSubmit(e) {
    e.preventDefault();

    const newErrors = {};
    if (!form.nome) newErrors.nome = "Service name is required.";
    if (!form.descricao) newErrors.descricao = "Description is required.";
    if (!form.valor || Number(form.valor) <= 0)
      newErrors.valor = "Invalid price.";
    if (!form.tipoServico)
      newErrors.tipoServico = "Select a service type.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        "http://localhost:5000/empresas/services",
        {
          nome: form.nome,
          descricao: form.descricao,
          valor: Number(form.valor),
          id_tipo_servico: form.tipoServico
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      navigate("/dashboard/empresa/services");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // ---------------------------------------------
  // RENDER
  // ---------------------------------------------
  return (
    <div className={styles.page}>
      <h2>Add new service</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div>
          <label>Service name</label>
          <input
            name="nome"
            value={form.nome}
            onChange={handleChange}
          />
          {errors.nome && <p className={styles.error}>{errors.nome}</p>}
        </div>

        <div>
          <label>Description</label>
          <textarea
            name="descricao"
            value={form.descricao}
            onChange={handleChange}
          />
          {errors.descricao && (
            <p className={styles.error}>{errors.descricao}</p>
          )}
        </div>

        <div className={styles.row}>
          <div>
            <label>Price (€)</label>
            <input
              name="valor"
              value={form.valor}
              onChange={handleChange}
            />
            {errors.valor && <p className={styles.error}>{errors.valor}</p>}
          </div>

          <div>
            <label>Service type</label>
            <select
              name="tipoServico"
              value={form.tipoServico}
              onChange={handleChange}
            >
              <option value="">Select type</option>
              {tipos.map((t) => (
                <option key={t.id_tiposervico} value={t.id_tiposervico}>
                  {t.designacao}
                </option>
              ))}
            </select>
            {errors.tipoServico && (
              <p className={styles.error}>{errors.tipoServico}</p>
            )}
          </div>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.cancel}
            onClick={() => navigate("/dashboard/empresa/services")}
          >
            Cancel
          </button>

          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Create service"}
          </button>
        </div>
      </form>
    </div>
  );
}
