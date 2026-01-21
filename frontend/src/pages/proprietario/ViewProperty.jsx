import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api";
import styles from "./ViewProperty.module.css";

export default function ViewProperty() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    nome: "",
    rua: "",
    nporta: "",
    cod_postal: "",
    localidade: "",
    capacidade: "",
    descricao: "",
    imagem: null, // File (opcional)
  });

  /* ================= LOAD PROPERTY ================= */
  useEffect(() => {
    fetchProperty();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function fetchProperty() {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get(`/imoveis/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProperty(res.data);

      setFormData({
        nome: res.data.nome ?? "",
        rua: res.data.rua ?? "",
        nporta: res.data.nporta ?? "",
        cod_postal: res.data.cod_postal ?? "",
        localidade: res.data.localidade ?? "", // se vier do join/backend
        capacidade: String(res.data.capacidade ?? ""),
        descricao: res.data.descricao ?? "",
        imagem: null, // nunca preenchemos com filename, só File novo
      });
    } catch (err) {
      console.error("Error loading property:", err);
    } finally {
      setLoading(false);
    }
  }

  /* ================= OPEN EDIT ================= */
  function openEditModal() {
    setErrors({});
    setShowModal(true);
  }

  /* ================= HANDLE INPUT ================= */
  function handleChange(e) {
    const { name, value, files } = e.target;

    if (name === "imagem") {
      setFormData((prev) => ({ ...prev, imagem: files?.[0] ?? null }));
      return;
    }

    if (name === "nporta" && !/^\d*$/.test(value)) return;
    if (name === "capacidade" && !/^\d*$/.test(value)) return;
    if (name === "cod_postal" && !/^\d{0,4}(-\d{0,3})?$/.test(value)) return;

    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  /* ================= UPDATE ================= */
  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting) return;

    const newErrors = {};

    if (!formData.nome.trim()) newErrors.nome = "Property name is required.";
    if (!formData.rua.trim()) newErrors.rua = "Street is required.";
    if (!formData.nporta) newErrors.nporta = "Door number is required.";
    if (!/^\d{4}-\d{3}$/.test(formData.cod_postal))
      newErrors.cod_postal = "Postal code must be in format 1234-567.";
    if (!formData.localidade.trim())
      newErrors.localidade = "Location is required.";
    if (!formData.capacidade || Number(formData.capacidade) <= 0)
      newErrors.capacidade = "Capacity must be greater than 0.";
    if (!formData.descricao.trim())
      newErrors.descricao = "Description is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");

      // ✅ PUT multipart (para imagem funcionar)
      const data = new FormData();
      data.append("nome", formData.nome);
      data.append("rua", formData.rua);
      data.append("nporta", formData.nporta);
      data.append("cod_postal", formData.cod_postal);
      data.append("localidade", formData.localidade);
      data.append("capacidade", formData.capacidade);
      data.append("descricao", formData.descricao);

      if (formData.imagem) data.append("imagem", formData.imagem);

      await api.put(`/imoveis/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setShowModal(false);
      await fetchProperty();
    } catch (err) {
      console.error("Error updating property:", err);
    } finally {
      setSubmitting(false);
    }
  }

  /* ================= DELETE ================= */
  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this property?"
    );
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");

      await api.delete(`/imoveis/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      navigate("/dashboard/proprietario/properties");
    } catch (err) {
      console.error("Error deleting property:", err);
    }
  }

  if (loading) return <p>Loading...</p>;
  if (!property) return <p>Property not found.</p>;

  return (
    <div className={styles.container}>
      {/* BACK */}
      <button
        className={styles.backLink}
        onClick={() => navigate("/dashboard/proprietario/properties")}
      >
        ← Back
      </button>

      {/* HEADER */}
      <div className={styles.header}>
        <div>
          <p className={styles.breadcrumb}>Properties · {property.nome}</p>

          <h1 className={styles.title}>{property.nome}</h1>
          <p className={styles.subtitle}>{property.rua}</p>
        </div>

        <div className={styles.actions}>
          <button className={styles.editButton} onClick={openEditModal}>
            Edit property
          </button>

          <button className={styles.deleteButton} onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>

      {/* META */}
      <div className={styles.meta}>
        <div>
          <span className={styles.metaLabel}>Door number</span>
          <span className={styles.metaValue}>{property.nporta}</span>
        </div>

        <div>
          <span className={styles.metaLabel}>Postal code</span>
          <span className={styles.metaValue}>{property.cod_postal}</span>
        </div>

        <div>
          <span className={styles.metaLabel}>Max capacity</span>
          <span className={styles.metaValue}>{property.capacidade} guests</span>
        </div>
      </div>

      {/* DESCRIPTION */}
      <div className={styles.section}>
        <h3>Description</h3>
        <p className={styles.description}>{property.descricao}</p>
      </div>

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2 className={styles.modalTitle}>Edit property</h2>

            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label>Property name</label>
                <input
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  className={errors.nome ? styles.inputError : ""}
                />
                {errors.nome && <p className={styles.error}>{errors.nome}</p>}
              </div>

              <div className={styles.formGroup}>
                <label>Street</label>
                <input
                  name="rua"
                  value={formData.rua}
                  onChange={handleChange}
                  className={errors.rua ? styles.inputError : ""}
                />
                {errors.rua && <p className={styles.error}>{errors.rua}</p>}
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Door number</label>
                  <input
                    name="nporta"
                    value={formData.nporta}
                    onChange={handleChange}
                    className={errors.nporta ? styles.inputError : ""}
                  />
                  {errors.nporta && (
                    <p className={styles.error}>{errors.nporta}</p>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label>Postal code</label>
                  <input
                    name="cod_postal"
                    value={formData.cod_postal}
                    onChange={handleChange}
                    className={errors.cod_postal ? styles.inputError : ""}
                  />
                  {errors.cod_postal && (
                    <p className={styles.error}>{errors.cod_postal}</p>
                  )}
                </div>
              </div>

              {/* ✅ Location */}
              <div className={styles.formGroup}>
                <label>Location</label>
                <input
                  name="localidade"
                  value={formData.localidade}
                  onChange={handleChange}
                  className={errors.localidade ? styles.inputError : ""}
                />
                {errors.localidade && (
                  <p className={styles.error}>{errors.localidade}</p>
                )}
              </div>

              <div className={styles.formGroup}>
                <label>Max capacity</label>
                <input
                  name="capacidade"
                  value={formData.capacidade}
                  onChange={handleChange}
                  className={errors.capacidade ? styles.inputError : ""}
                />
                {errors.capacidade && (
                  <p className={styles.error}>{errors.capacidade}</p>
                )}
              </div>

              <div className={styles.formGroup}>
                <label>Description</label>
                <textarea
                  rows="3"
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleChange}
                  className={errors.descricao ? styles.inputError : ""}
                />
                {errors.descricao && (
                  <p className={styles.error}>{errors.descricao}</p>
                )}
              </div>

              {/* ✅ Image - MESMO UI do Create */}
              <div className={styles.formGroup}>
                <label>Property image (optional)</label>

                <label className={styles.fileInput}>
                  <span>Select image</span>
                  <input
                    type="file"
                    accept="image/*"
                    name="imagem"
                    onChange={handleChange}
                  />
                </label>

                {formData.imagem && (
                  <span className={styles.fileName}>{formData.imagem.name}</span>
                )}
              </div>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.secondaryButton}
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className={styles.primaryButton}
                  disabled={submitting}
                >
                  {submitting ? "Saving..." : "Save changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
