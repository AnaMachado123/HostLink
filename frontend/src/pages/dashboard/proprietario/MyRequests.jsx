import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./MyRequests.module.css";

export default function MyRequests() {
  const token = localStorage.getItem("token");
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    async function load() {
      const res = await axios.get(
        "http://localhost:5000/pedidos/me",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPedidos(res.data);
    }
    load();
  }, [token]);

  return (
    <div className={styles.page}>
      <h2>Os meus pedidos</h2>

      {pedidos.length === 0 && <p>Sem pedidos.</p>}

      {pedidos.map(p => (
        <div key={p.id_solicitarservico} className={styles.card}>
          <h3>{p.descricao}</h3>
          <p>Status: <b>{p.status}</b></p>
          <p>Valor: €{p.valor}</p>

          <ul>
            {p.servicos.map(s => (
              <li key={s.id_servico}>
                {s.nome} (€{s.valor})
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
