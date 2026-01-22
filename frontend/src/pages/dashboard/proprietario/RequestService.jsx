import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function RequestService() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [descricao, setDescricao] = useState("");

  async function submit() {
    await axios.post(
      "http://localhost:5000/servicos/request",
      {
        id_servico: id,
        descricao
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    navigate("/dashboard/proprietario");
  }

  return (
    <div className={styles.page}>
      <h2>Request service</h2>

      <label>Description / notes</label>
      <textarea
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
      />

      <button onClick={submit}>Submit request</button>
    </div>
  );
}
