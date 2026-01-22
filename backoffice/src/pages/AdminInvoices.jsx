import { useEffect, useState } from "react";
import api from "../services/api";
import styles from "./AdminInvoices.module.css";

export default function AdminInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await api.get("/admin/invoices");
      setInvoices(res.data);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <p>Loading invoices...</p>;

  return (
    <div className={styles.page}>
      <h2>Invoices</h2>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>#</th>
            <th>Company</th>
            <th>Client</th>
            <th>Service</th>
            <th>Date</th>
            <th>Total</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {invoices.map((inv) => (
            <tr key={inv.id_fatura}>
              <td>{inv.id_fatura}</td>
              <td>{inv.empresa_nome}</td>
              <td>{inv.cliente_nome}</td>
              <td>{inv.servico_nome}</td>
              <td>{new Date(inv.dt_emissao).toLocaleDateString()}</td>
              <td>€{inv.valor}</td>
              <td>{inv.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
