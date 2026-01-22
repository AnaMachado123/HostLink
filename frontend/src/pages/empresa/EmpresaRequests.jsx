import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import styles from "./EmpresaRequests.module.css";

export default function EmpresaRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");

  async function fetchRequests() {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:5000/pedidos/empresa",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json();

      // ✅ NORMALIZAR STATUS (APENAS TRADUÇÃO)
      const normalized = (Array.isArray(data) ? data : [])
        .map((r) => ({
          ...r,
          status:
            r.status === "pendente"
              ? "pending"
              : r.status === "agendado"
              ? "accepted"
              : r.status === "andamento"
              ? "in_progress"
              : r.status === "concluido"
              ? "completed"
              : r.status === "cancelado"
              ? "rejected"
              : r.status
        }))
        // ✅ ORDENAR POR CRIAÇÃO (mais recente primeiro)
        .sort(
          (a, b) =>
            b.id_solicitarservico - a.id_solicitarservico
        );

      setRequests(normalized);
    } catch (err) {
      console.error(err);
      toast.error("Error loading requests");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRequests();
  }, []);

  async function updateStatus(id, newStatus) {
    try {
      const token = localStorage.getItem("token");

      // 🔥 MAP PARA BACKEND (PT)
      const backendStatus =
        newStatus === "accepted"
          ? "agendado"
          : "cancelado";

      const res = await fetch(
        `http://localhost:5000/pedidos/${id}/estado`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ novoEstado: backendStatus })
        }
      );

      if (!res.ok) throw new Error();

      // 🔄 atualizar estado localmente
      setRequests((prev) =>
        prev.map((r) =>
          r.id_solicitarservico === id
            ? {
                ...r,
                status:
                  backendStatus === "agendado"
                    ? "accepted"
                    : "rejected"
              }
            : r
        )
      );

      toast.success("Request updated");
    } catch {
      toast.error("Error updating request");
    }
  }

  
  const filteredRequests = requests
  .filter((r) => {
    if (filter === "accepted") {
      return ["accepted", "in_progress", "completed"].includes(
        r.status
      );
    }
    return r.status === filter;
  })
  .sort((a, b) => {
    if (filter === "accepted") {
    
      return b.id_solicitarservico - a.id_solicitarservico;
    }
    return 0;
  });

if (loading) return <p>Loading...</p>;



  return (
    <div className={styles.container}>
      {/* HEADER */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Service Requests</h1>
          <p className={styles.subtitle}>
            Manage incoming service requests
          </p>
        </div>
      </div>

      {/* FILTERS */}
      <div className={styles.filtersCard}>
        <div className={styles.filters}>
          {[
            { key: "pending", label: "Pending" },
            { key: "accepted", label: "Accepted" },
            { key: "rejected", label: "Rejected" }
          ].map((f) => (
            <button
              key={f.key}
              className={`${styles.filterBtn} ${
                filter === f.key ? styles.active : ""
              }`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* LIST */}
      {filteredRequests.length === 0 ? (
        <div className={styles.empty}>
          No requests found.
        </div>
      ) : (
        <div className={styles.list}>
          {filteredRequests.map((req) => (
            <div
              key={req.id_solicitarservico}
              className={styles.serviceCard}
            >
              {/* CARD HEADER */}
              <div className={styles.cardHeader}>
                <div>
                  <div className={styles.serviceName}>
                    {req.servico_nome}
                  </div>
                  <span className={styles.categoryBadge}>
                    {req.status.replace("_", " ")}
                  </span>
                </div>
              </div>

              {/* META */}
              <div className={styles.meta}>
                <div>
                  <div className={styles.metaLabel}>
                    Property
                  </div>
                  <div className={styles.metaValue}>
                    {req.nome_imovel}
                  </div>
                </div>

                <div>
                  <div className={styles.metaLabel}>
                    Date
                  </div>
                  <div className={styles.metaValue}>
                    {req.data_formatada}
                  </div>
                </div>

                <div>
                  <div className={styles.metaLabel}>
                    Total
                  </div>
                  <div className={styles.metaValue}>
                    €{req.valor}
                  </div>
                </div>
              </div>

              {/* OBSERVATIONS */}
              {req.descricao && (
                <div className={styles.description}>
                  <strong>Observations</strong>
                  <p>{req.descricao}</p>
                </div>
              )}

              {/* ACTIONS */}
              {req.status === "pending" && (
                <div className={styles.cardActions}>
                  <button
                    className={styles.primaryAction}
                    onClick={() =>
                      updateStatus(
                        req.id_solicitarservico,
                        "accepted"
                      )
                    }
                  >
                    Accept
                  </button>

                  <button
                    className={styles.secondaryAction}
                    onClick={() =>
                      updateStatus(
                        req.id_solicitarservico,
                        "rejected"
                      )
                    }
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
