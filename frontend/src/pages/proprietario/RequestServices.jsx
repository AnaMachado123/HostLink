import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styles from "./RequestServices.module.css";

export default function RequestServices() {
  const navigate = useNavigate();

  /* ================= STATE ================= */
  const [services, setServices] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedProperty, setSelectedProperty] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const [showModal, setShowModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const [formData, setFormData] = useState({
    date: "",
    description: ""
  });

  const [dateError, setDateError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem("token");

        const [servicesRes, propertiesRes] = await Promise.all([
          fetch("http://localhost:5000/servicos/public", {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch("http://localhost:5000/auth/imoveis/me", {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        if (!servicesRes.ok || !propertiesRes.ok) {
          throw new Error("Failed to load data");
        }

        const servicesData = await servicesRes.json();
        const propertiesData = await propertiesRes.json();

        setServices(
          servicesData.map((s) => ({
            id: s.id_servico,
            name: s.nome,
            description: s.descricao,
            price:
              s.tipo_preco === "hourly"
                ? `€${s.valor} / hour`
                : `€${s.valor} (fixed)`,
            type:
              s.id_tiposervico === 1
                ? "Cleaning"
                : s.id_tiposervico === 2
                ? "Maintenance"
                : "Transport"
          }))
        );

        setProperties(propertiesData);

        if (propertiesData.length > 0) {
          setSelectedProperty(String(propertiesData[0].id_imovel));
        }
      } catch (err) {
        console.error(err);
        toast.error("Error loading data");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  /* ================= DERIVED ================= */
  const selectedPropertyObj = properties.find(
    (p) => String(p.id_imovel) === String(selectedProperty)
  );

  const filteredServices =
    activeFilter === "All"
      ? services
      : services.filter((s) => s.type === activeFilter);

  /* ================= POST PEDIDO ================= */
  async function handleSubmit() {
    console.log(" HANDLE SUBMIT CHAMADO");

    if (!formData.date) {
      console.error(" DATE EMPTY");
      setDateError(true);
      return;
    }

    if (!selectedService) {
      toast.error("Service not selected");
      return;
    }

    const payload = {
      data: formData.date,
      descricao: formData.description,
      servicos: [selectedService.id],
      id_imovel: selectedProperty
    };

    console.log(" PAYLOAD A ENVIAR:", payload);

    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/pedidos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      console.log("📡 RESPONSE STATUS:", res.status);

      if (res.status === 409) {
        const err = await res.json();
        toast.error(err.error);
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to create request");
      }

      toast.success("Request created successfully");

      setShowModal(false);
      setSelectedService(null);
      setFormData({ date: "", description: "" });
      setDateError(false);

      navigate("/dashboard/proprietario/my-requests");
    } catch (err) {
      console.error(err);
      toast.error("Error creating request");
    } finally {
      setSubmitting(false);
    }
  }

  /* ================= UI ================= */
  if (loading) return <p>Loading services...</p>;

  return (
    <div className={styles.page}>
      {/* HEADER */}
      <div className={styles.topBar}>
        <div>
          <h1 style={{ color: "#0a2344", marginBottom: 6 }}>
            Requests
          </h1>
          <p style={{ fontSize: 14, color: "#64748b" }}>
            Request services for your properties
          </p>
        </div>

        <button
          className={styles.secondaryAction}
          onClick={() =>
            navigate("/dashboard/proprietario/my-requests")
          }
        >
          My Requests
        </button>
      </div>

      {/* CONTROLS */}
      <div className={styles.topBar}>
        <div className={styles.propertySelect}>
          <label>Select property</label>
          <select
            value={selectedProperty}
            onChange={(e) => setSelectedProperty(e.target.value)}
          >
            {properties.map((p) => (
              <option key={p.id_imovel} value={p.id_imovel}>
                {p.nome}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.filters}>
          {["All", "Cleaning", "Maintenance", "Transport"].map((f) => (
            <button
              key={f}
              className={activeFilter === f ? styles.active : ""}
              onClick={() => setActiveFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div className={styles.content}>
        <div className={styles.servicesGrid}>
          {filteredServices.map((service) => (
            <div key={service.id} className={styles.serviceCard}>
              <h3>{service.name}</h3>
              <span
                className={`${styles.tag} ${
                  styles[service.type.toLowerCase()]
                }`}
              >
                {service.type}
              </span>
              <p className={styles.description}>
                {service.description}
              </p>
              <div className={styles.price}>{service.price}</div>
              <button
                className={styles.requestBtn}
                onClick={() => {
                  setSelectedService(service);
                  setShowModal(true);
                }}
              >
                Request Service
              </button>
            </div>
          ))}
        </div>

        <div className={styles.mapPanel}>
          <div className={styles.mapPlaceholder}>
            Map will appear here
          </div>
        </div>
      </div>

      {/* MODAL */}
      {showModal && selectedService && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2 className={styles.modalTitle}>
              Request Service
            </h2>

            <div className={styles.formGroup}>
              <label>Service</label>
              <input value={selectedService.name} disabled />
            </div>

            <div className={styles.formGroup}>
              <label>Property</label>
              <input
                value={selectedPropertyObj?.nome || ""}
                disabled
              />
            </div>

            <div className={styles.formGroup}>
              <label>Date *</label>
              <input
                type="date"
                value={formData.date}
                className={dateError ? styles.inputError : ""}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    date: e.target.value
                  });
                  setDateError(false);
                }}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Observations</label>
              <textarea
                rows="3"
                value={formData.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: e.target.value
                  })
                }
              />
            </div>

            <div className={styles.formGroup}>
              <label>Price</label>
              <input value={selectedService.price} disabled />
            </div>

            <div className={styles.modalActions}>
              <button
                className={styles.secondaryAction}
                onClick={() => setShowModal(false)}
                disabled={submitting}
              >
                Cancel
              </button>

              <button
                className={styles.primaryAction}
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting
                  ? "Submitting..."
                  : "Confirm Request"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
