import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./EmpresaServices.module.css";

export default function EmpresaServices() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadServices() {
      if (user?.role !== "empresa" || user?.status !== "ACTIVE") {
        navigate("/dashboard/empresa");
        return;
      }

      try {
        const res = await axios.get(
          "http://localhost:5000/empresas/services",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setServices(res.data || []);
      } catch (err) {
        console.error(err);
        setError("Erro ao carregar serviços.");
      } finally {
        setLoading(false);
      }
    }

    loadServices();
  }, [navigate, token, user]);

  if (loading) return <p className={styles.state}>A carregar...</p>;
  if (error) return <p className={styles.stateError}>{error}</p>;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h2>My Services</h2>
        <button onClick={() => navigate("new")}>
          + Add service
        </button>
      </div>

      {services.length === 0 ? (
        <p>You don’t have any services yet.</p>
      ) : (
        <div className={styles.list}>
          {services.map(service => (
            <div key={service.id_servico} className={styles.card}>
              <h3>{service.nome}</h3>
              <p>{service.descricao}</p>
              <p><strong>€ {Number(service.valor).toFixed(2)}</strong></p>
              <p className={styles.type}>{service.tipo_servico}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
