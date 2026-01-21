import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./MyRequests.module.css";

export default function MyRequests() {
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRequests() {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:5000/pedidos/me", {
          headers: { Authorization: `Bearer ${token}` }
        });

        const data = await res.json();

        // ✅ MAP DE STATUS — SÓ TRADUÇÃO
        const normalized = Array.isArray(data)
          ? data.map((r) => ({
              ...r,
              status:
                r.status === "pendente"
                  ? "Pending"
                  : r.status === "agendado"
                  ? "Accepted"
                  : r.status === "andamento"
                  ? "In Progress"
                  : r.status === "concluido"
                  ? "Completed"
                  : r.status === "cancelado"
                  ? "Rejected"
                  : r.status // fallback seguro
            }))
            .sort(
  (a, b) => b.id_solicitarservico - a.id_solicitarservico
)

          : [];

        setRequests(normalized);
      } catch (err) {
        console.error("FETCH MY REQUESTS ERROR:", err);
        setRequests([]);
      } finally {
        setLoading(false);
      }
    }

    fetchRequests();
  }, []);

  if (loading) return <p>Loading requests...</p>;

  return (
    <div className={styles.page}>
      {/* HEADER */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>My Requests</h1>
          <p className={styles.subtitle}>
            View all service requests you have made
          </p>
        </div>

        <button
          className={styles.primaryButton}
          onClick={() =>
            navigate("/dashboard/proprietario/services")
          }
        >
          Back to Requests
        </button>
      </div>

      {/* LIST */}
      {requests.length === 0 ? (
        <div className={styles.empty}>
          You have no requests yet.
        </div>
      ) : (
        <div className={styles.list}>
          {requests.map((req) => (
            <div
              key={req.id_solicitarservico}
              className={styles.card}
            >
              <div>
                <strong>Property:</strong>{" "}
                {req.nome_imovel || "—"}
              </div>

              <div>
                <strong>Date:</strong>{" "}
                {req.data_formatada}
              </div>

              <div>
                <strong>Status:</strong>{" "}
                <span
                  className={`${styles.status} ${
                    req.status === "Pending"
                      ? styles.statusPending
                      : req.status === "Accepted"
                      ? styles.statusAccepted
                      : req.status === "In Progress"
                      ? styles.statusInProgress
                      : req.status === "Completed"
                      ? styles.statusCompleted
                      : styles.statusRejected
                  }`}
                >
                  {req.status}
                </span>
              </div>

              {/* OBSERVATIONS */}
              {req.descricao && (
                <div className={styles.description}>
                  <strong>Observations:</strong>
                  <p>{req.descricao}</p>
                </div>
              )}

              <div>
                <strong>Total:</strong> €{req.valor}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
