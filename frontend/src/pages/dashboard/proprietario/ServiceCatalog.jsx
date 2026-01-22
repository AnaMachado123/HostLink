import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./ServiceCatalog.module.css";

export default function ServiceCatalog() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCatalog() {
      try {
        const res = await axios.get(
          "http://localhost:5000/services/catalog",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setServices(res.data || []);
      } catch (err) {
        console.error("Error loading catalog:", err);
      } finally {
        setLoading(false);
      }
    }

    loadCatalog();
  }, [token]);

  if (loading) return <p className={styles.state}>Loading catalog...</p>;

  return (
    <div className={styles.page}>
      <h2>Service Catalog</h2>

      {services.length === 0 ? (
        <p>No services available.</p>
      ) : (
        services.map(service => (
          <div key={service.id_servico} className={styles.card}>
            <h3>{service.nome}</h3>
            <p>{service.descricao}</p>
            <p><b>Company:</b> {service.empresa_nome}</p>
            <p><b>Type:</b> {service.tipo}</p>
            <p><b>Price:</b> € {service.valor}</p>

            <button
              onClick={() =>
                navigate(
                  `/dashboard/proprietario/services/${service.id_servico}/request`
                )
              }
            >
              Request service
            </button>
          </div>
        ))
      )}
    </div>
  );
}
