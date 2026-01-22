import { useNavigate } from "react-router-dom";
import styles from "./InvoiceCard.module.css";

export default function InvoiceCard({ invoice }) {
  const navigate = useNavigate();

  return (
    <div className={styles.card}>
      {/* HEADER */}
      <div className={styles.cardHeader}>
        <div>
          <h3 className={styles.invoiceNumber}>
            Invoice #{invoice.id_fatura}
          </h3>

          <span className={styles.date}>
            {new Date(invoice.dt_emissao).toLocaleDateString()}
          </span>
        </div>

        <div className={styles.headerRight}>
          <span className={styles.status}>Issued</span>
          <span className={styles.total}>€{invoice.valor}</span>
        </div>
      </div>

      {/* BODY */}
      <div className={styles.cardBody}>
        <div>
          <span className={styles.label}>Service</span>
          <span className={styles.value}> {invoice.servico_nome}</span>
        </div>

        <div>
          <span className={styles.label}>Property</span>
          <span className={styles.value}> {invoice.nome_imovel}</span>
        </div>
      </div>

      {/* ACTION */}
      <div className={styles.actions}>
        <button
          className={styles.viewBtn}
          onClick={() => navigate(`./${invoice.id_fatura}`)}
        >
          View
        </button>
      </div>
    </div>
  );
}
