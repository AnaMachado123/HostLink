import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import styles from "./ReviewUser.module.css";

const USER_LABELS = {
  nome: "Name",
  email: "E-mail",
  role: "Type of User",
  status: "Account Status",
};

const EMPRESA_LABELS = {
  nif: "NIF",
  nome_empresa: "Company name",
  telefone: "Telephone",
  rua: "Street",
  codigo_postal: "Postal Code",
  cidade: "City",
};

const PROPRIETARIO_LABELS = {
  nif: "NIF",
  telefone: "Telephone",
  rua: "Street",
  codigo_postal: "Postal Code",
  cidade: "City",
};


export default function ReviewUser() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [history, setHistory] = useState(null);

  function formatDate(date) {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-GB");
  }

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get(`/admin/users/${id}`);
        setData(res.data);
      } catch (err) {
        console.error("Erro ao carregar utilizador", err);
      } finally {
        setLoading(false);
      }
    }

    async function loadHistory() {
      const res = await api.get(`/admin/users/${id}/history`);
      setHistory(res.data);
    }

    loadHistory();
    load();
  }, [id]);

  if (loading) return <p>A carregar...</p>;
  if (!data) return <p>Utilizador não encontrado.</p>;

  const { user, profile } = data;

  const profileLabels =
    user.role === "empresa" ? EMPRESA_LABELS : PROPRIETARIO_LABELS;


  return (
    <div className={styles.page}>
      <button className={styles.back} onClick={() => navigate(-1)}>
        ← Return to list
      </button>

      <h2>Account review</h2>

      <div className={styles.grid}>
        {/* UTILIZADOR */}
        <div className={styles.card}>
          <h3>User</h3>

          {Object.entries(USER_LABELS).map(([key, label]) => (
            <div key={key} className={styles.row}>
              <span className={styles.label}>{label}</span>
              <span>{user[key]}</span>
            </div>
          ))}
        </div>

        {/* PERFIL */}
        <div className={styles.card}>
          <h3>
            {user.role === "empresa"
              ? "Company profile"
              : "Owner profile"}
          </h3>

          {profile ? (
            Object.entries(profileLabels).map(([key, label]) => (
              <div key={key} className={styles.row}>
                <span className={styles.label}>{label}</span>
                <span>{profile[key] ?? "-"}</span>
              </div>
            ))
          ) : (
            <p>No associated profile.</p>
          )}
        </div>


        {history && (
          <div className={styles.card}>
            <h3>Activity History</h3>

            {user.role === "proprietario" && (
              <>
                <div className={styles.row}>
                  <span className={styles.label}>Properties registered</span>
                  <span>{history.total_imoveis}</span>
                </div>

                <div className={styles.row}>
                  <span className={styles.label}>Service requests</span>
                  <span>{history.total_pedidos}</span>
                </div>

                <div className={styles.row}>
                  <span className={styles.label}>Last activity</span>
                  <span>{formatDate(history.ultima_atividade)}</span>
                </div>
              </>
            )}

            {user.role === "empresa" && (
              <>
                <div className={styles.row}>
                  <span className={styles.label}>Services offered</span>
                  <span>{history.servicos_oferecidos}</span>
                </div>

                <div className={styles.row}>
                  <span className={styles.label}>Requests received</span>
                  <span>{history.pedidos_recebidos}</span>
                </div>

                <div className={styles.row}>
                  <span className={styles.label}>Services completed</span>
                  <span>{history.servicos_concluidos}</span>
                </div>
              </>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
