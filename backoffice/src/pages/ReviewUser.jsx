import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import styles from "./ReviewUser.module.css";

export default function ReviewUser() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // ---------------------------------------------
  // LOAD USER + PROFILE
  // ---------------------------------------------
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

    load();
  }, [id]);

  if (loading) return <p>A carregar...</p>;
  if (!data) return <p>Utilizador não encontrado.</p>;

  const { user, profile } = data;


  // ---------------------------------------------
  // RENDER
  // ---------------------------------------------
  return (
    <div className={styles.page}>
      <button className={styles.back} onClick={() => navigate(-1)}>
        ← Voltar à lista
      </button>

      <h2>Revisão de Conta</h2>

      {/* UTILIZADOR */}
      <div className={styles.card}>
        <h3>Utilizador</h3>

        <div className={styles.row}>
          <span className={styles.label}>Nome:</span> {user.nome}
        </div>

        <div className={styles.row}>
          <span className={styles.label}>Email:</span> {user.email}
        </div>

        <div className={styles.row}>
          <span className={styles.label}>Tipo:</span> {user.role}
        </div>

        <div className={styles.row}>
          <span className={styles.label}>Status:</span> {user.status}
        </div>
      </div>

      {/* PERFIL */}
      <div className={styles.card}>
        <h3>Perfil</h3>

        {profile ? (
          Object.entries(profile).map(([key, value]) => (
            <div key={key} className={styles.row}>
              <span className={styles.label}>{key}:</span> {String(value)}
            </div>
          ))
        ) : (
          <p>Sem perfil associado.</p>
        )}
      </div>

    </div>
  );
}
