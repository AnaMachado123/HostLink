import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import styles from "./Properties.module.css";

export default function Properties() {
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    nome: "",
    rua: "",
    nporta: "",
    cod_postal: "",
    localidade: "",
    capacidade: "",
    descricao: "",
    imagem: null,
  });

  const [errors, setErrors] = useState({});

  /* ================= LOAD MY PROPERTIES ================= */
  useEffect(() => {
    fetchMyProperties();
  }, []);

  async function fetchMyProperties() {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/imoveis/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProperties(res.data);
    } catch (err) {
      console.error("Error fetching properties:", err);
    } finally {
      setLoading(false);
    }
  }

  /* ================= HANDLE INPUT ================= */
  function handleChange(e) {
    const { name, value } = e.target;

    if (name === "nporta" && !/^\d*$/.test(value)) return;
    if (name === "capacidade" && !/^\d*$/.test(value)) return;
    if (name === "cod_postal" && !/^\d{0,4}(-\d{0,3})?$/.test(value)) return;

    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  /* ================= SUBMIT ================= */
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
      newErrors.localidade = "City is required.";
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

      const data = new FormData();
      data.append("nome", formData.nome);
      data.append("rua", formData.rua);
      data.append("nporta", formData.nporta);
      data.append("cod_postal", formData.cod_postal);
      data.append("localidade", formData.localidade);
      data.append("capacidade", formData.capacidade);
      data.append("descricao", formData.descricao);

      if (formData.imagem) {
        data.append("imagem", formData.imagem);
      }

      await api.post("/imoveis", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setShowModal(false);
      setFormData({
        nome: "",
        rua: "",
        nporta: "",
        cod_postal: "",
        localidade: "",
        capacidade: "",
        descricao: "",
        imagem: null,
      });

      await fetchMyProperties();
    } catch (err) {
      console.error("Error creating property:", err);
    } finally {
      setSubmitting(false);
    }
  }

  /* ================= RENDER ================= */
  return (
    <div className={styles.container}>
      {/* HEADER */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>My Properties</h1>
          <p className={styles.subtitle}>
            Manage and organize your properties
          </p>
        </div>

        <button
          className={styles.primaryButton}
          onClick={() => setShowModal(true)}
        >
          + New Property
        </button>
      </div>

      {/* LIST */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className={styles.propertiesList}>
          {properties.map((property) => (
            <div key={property.id_imovel} className={styles.card}>
              {property.imagem && (
                <img
                  src={`http://localhost:5000/uploads/${property.imagem}`}
                  alt={property.nome}
                  className={styles.cardImage}
                />
              )}

              <div className={styles.cardInfo}>
                <h4>{property.nome}</h4>
                <p>
                  {property.rua} · {property.cod_postal}
                </p>
                <span>
                  max. capacity: {property.capacidade} guests
                </span>
              </div>

              <div className={styles.cardActions}>
                <button
                  onClick={() =>
                    navigate(
                      `/dashboard/proprietario/properties/${property.id_imovel}`
                    )
                  }
                >
                  View →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE MODAL */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2 className={styles.modalTitle}>Create new property</h2>

            <form onSubmit={handleSubmit}>
              {/* Property name */}
              <div className={styles.formGroup}>
                <label>Property name</label>
                <input
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                />
                {errors.nome && <p className={styles.error}>{errors.nome}</p>}
              </div>

              {/* Street */}
              <div className={styles.formGroup}>
                <label>Street</label>
                <input
                  name="rua"
                  value={formData.rua}
                  onChange={handleChange}
                />
                {errors.rua && <p className={styles.error}>{errors.rua}</p>}
              </div>

              {/* Door + Postal */}
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Door number</label>
                  <input
                    name="nporta"
                    value={formData.nporta}
                    onChange={handleChange}
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
                  />
                  {errors.cod_postal && (
                    <p className={styles.error}>{errors.cod_postal}</p>
                  )}
                </div>
              </div>

              {/* City */}
              <div className={styles.formGroup}>
                <label>City</label>
                <input
                  name="localidade"
                  value={formData.localidade}
                  onChange={handleChange}
                />
                {errors.localidade && (
                  <p className={styles.error}>{errors.localidade}</p>
                )}
              </div>

              {/* Capacity */}
              <div className={styles.formGroup}>
                <label>Max capacity</label>
                <input
                  name="capacidade"
                  value={formData.capacidade}
                  onChange={handleChange}
                />
                {errors.capacidade && (
                  <p className={styles.error}>{errors.capacidade}</p>
                )}
              </div>

              {/* Description */}
              <div className={styles.formGroup}>
                <label>Description</label>
                <textarea
                  name="descricao"
                  rows="3"
                  value={formData.descricao}
                  onChange={handleChange}
                />
                {errors.descricao && (
                  <p className={styles.error}>{errors.descricao}</p>
                )}
              </div>

              {/* Image */}
              <div className={styles.formGroup}>
                <label>Property image (optional)</label>
                <label className={styles.fileInput}>
                  <span>Select image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        imagem: e.target.files[0],
                      })
                    }
                  />
                </label>
              </div>

              {/* Actions */}
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
                  {submitting ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
