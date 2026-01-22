import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import styles from "./InvoiceView.module.css";

export default function InvoiceView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInvoice() {
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
        const found = data.find(
          (f) => String(f.id_fatura) === String(id)
        );

        setInvoice(found || null);
      } catch {
        setInvoice(null);
      } finally {
        setLoading(false);
      }
    }

    loadInvoice();
  }, [id]);

  function downloadPDF() {
    if (!invoice) return;

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("HostLink - Invoice", 20, 20);

    doc.setFontSize(11);
    doc.text(
      "Academic project only - Not a valid fiscal document",
      20,
      30
    );

    doc.line(20, 34, 190, 34);

    let y = 45;

    doc.setFontSize(12);
    doc.text(`Invoice #${invoice.id_fatura}`, 20, y);
    y += 8;

    doc.text(
      `Issue Date: ${new Date(invoice.dt_emissao).toLocaleDateString()}`,
      20,
      y
    );
    y += 10;

    doc.text(`Service: ${invoice.servico_nome}`, 20, y);
    y += 8;

    doc.text(`Property: ${invoice.nome_imovel}`, 20, y);
    y += 8;

    doc.text("Status: Issued", 20, y);
    y += 10;

    doc.setFontSize(14);
    doc.text(`Total Amount: €${invoice.valor}`, 20, y);
    y += 12;

    doc.setFontSize(10);
    doc.text(
      "Note: This invoice includes a 10% platform commission allocated to the service provider company.",
      20,
      y,
      { maxWidth: 170 }
    );

    doc.save(`invoice_${invoice.id_fatura}.pdf`);
  }

  if (loading) return <p>Loading invoice...</p>;
  if (!invoice) return <p>Invoice not found.</p>;

  return (
    <div className={styles.page}>
      <div className={styles.invoiceBox}>
        {/* HEADER */}
        <div className={styles.header}>
          <div>
            <h1>Invoice #{invoice.id_fatura}</h1>
            <span className={styles.date}>
              {new Date(invoice.dt_emissao).toLocaleDateString()}
            </span>
          </div>
          <span className={styles.status}>Issued</span>
        </div>

        {/* NOTICE */}
        <div className={styles.notice}>
          Academic project only – not a valid fiscal document
        </div>

        {/* DETAILS */}
        <div className={styles.details}>
          <div>
            <span>Service</span>
            <strong>{invoice.servico_nome}</strong>
          </div>

          <div>
            <span>Property</span>
            <strong>{invoice.nome_imovel}</strong>
          </div>

          <div>
            <span>Total Amount</span>
            <strong>€{invoice.valor}</strong>
          </div>
        </div>

        {/* NOTE */}
        <p className={styles.note}>
          This invoice includes a 10% platform commission allocated to
          the service provider company.
        </p>

        {/* ACTIONS */}
        <div className={styles.actions}>
          <button onClick={() => navigate(-1)}>Back</button>
          <button onClick={downloadPDF}>Download PDF</button>
        </div>
      </div>
    </div>
  );
}
