import { useEffect, useState } from "react";
import InvoiceCard from "./InvoiceCard";
import styles from "./Invoices.module.css";

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInvoices() {
      try {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));

        const endpoint =
          user.role === "empresa"
            ? "http://localhost:5000/faturas/empresa"
            : "http://localhost:5000/faturas/proprietario";

        const res = await fetch(endpoint, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const data = await res.json();
        setInvoices(Array.isArray(data) ? data : []);
      } catch {
        setInvoices([]);
      } finally {
        setLoading(false);
      }
    }

    fetchInvoices();
  }, []);

  if (loading) return <p>Loading invoices...</p>;

  const sortedInvoices = [...invoices].sort(
    (a, b) => new Date(b.dt_emissao) - new Date(a.dt_emissao)
  );

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Invoices</h1>
        <p>View and manage your invoices</p>
      </div>

      {sortedInvoices.length === 0 ? (
        <div className={styles.empty}>No invoices available.</div>
      ) : (
        <div className={styles.list}>
          {sortedInvoices.map((inv) => (
            <InvoiceCard
              key={inv.id_fatura}
              invoice={inv}
            />
          ))}
        </div>
      )}
    </div>
  );
}
