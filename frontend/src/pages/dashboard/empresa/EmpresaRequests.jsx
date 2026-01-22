import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./EmpresaRequests.module.css";

export default function EmpresaRequests() {
  const token = localStorage.getItem("token");
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await axios.get(
        "http://localhost:5000/pedidos/empresa",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPedidos(res.data);
      setLoading(false);
    }
    load();
  }, [token]);

  async function updateStatus(id, status) {
    await axios.patch(
      `http://localhost:5000/pedidos/${id}/status`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setPedidos(pedidos =>
      pedidos.map(p =>
        p.id_solicitarservico === id ? { ...p, status } : p
      )
    );
  }

  if (loading) return <p>A carregar pedidos...</p>;

  return (
    <div className={styles.page}>
      <h2>Pedidos Recebidos</h2>

      {pedidos.length === 0 && <p>Sem pedidos.</p>}

      {pedidos.map(p => (
        <div key={p.id_solicitarservico} className={styles.card}>
          <h3>{p.descricao}</h3>
          <p>Status: <b>{p.status}</b></p>

          <ul>
            {p.servicos.map(s => (
              <li key={s.id_servico}>
                {s.nome} (€{s.valor})
              </li>
            ))}
          </ul>

          <select
            value={p.status}
            onChange={e =>
              updateStatus(p.id_solicitarservico, e.target.value)
            }
          >
            <option value="pendente">Pendente</option>
            <option value="agendado">Agendado</option>
            <option value="andamento">Em andamento</option>
            <option value="concluido">Concluído</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </div>
      ))}
    </div>
  );
}
