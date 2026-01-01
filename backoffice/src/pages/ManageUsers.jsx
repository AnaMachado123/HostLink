import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const navigate = useNavigate();


  // ---------------------------------------------
  // LOAD PENDING USERS
  // ---------------------------------------------
  useEffect(() => {
    fetchPendingUsers();
  }, []);

  async function fetchPendingUsers() {
    try {
      const response = await api.get("/admin/users");
      setUsers(response.data);
    } catch (err) {
      setError("Erro ao carregar utilizadores pendentes.");
    } finally {
      setLoading(false);
    }
  }

  // ---------------------------------------------
  // APPROVE USER
  // ---------------------------------------------
  async function approveUser(id) {
    const confirmed = window.confirm(
      "Tens a certeza que queres aprovar esta conta?"
    );
    if (!confirmed) return;

    try {
      await api.post(`/admin/users/${id}/approve`);
      setUsers(prev => prev.filter(u => u.id_utilizador !== id));
    } catch (err) {
      alert("Erro ao aprovar utilizador.");
    }
  }

  // ---------------------------------------------
  // REJECT USER
  // ---------------------------------------------
  async function rejectUser(id) {
    const confirmed = window.confirm(
      "Tens a certeza que queres rejeitar esta conta?"
    );
    if (!confirmed) return;

    try {
      await api.post(`/admin/users/${id}/reject`);
      setUsers(prev => prev.filter(u => u.id_utilizador !== id));
    } catch (err) {
      alert("Erro ao rejeitar utilizador.");
    }
  }

  // ---------------------------------------------
  // RENDER STATES
  // ---------------------------------------------
  if (loading) return <p>A carregar utilizadores...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Contas Pendentes de Aprovação</h2>

      {users.length === 0 ? (
        <p>Não existem contas pendentes.</p>
      ) : (
        <table width="100%" border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Tipo</th>
              <th>Estado</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id_utilizador}>
                <td>
                  <button
                    onClick={() => navigate(`/admin/users/${user.id_utilizador}`)}
                    style={{ background: "none", border: "none", color: "#007bff", cursor: "pointer" }}
                  >
                    {user.nome}
                  </button>
                </td>

                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.status}</td>
                <td>
                  <button onClick={() => approveUser(user.id_utilizador)}>
                    Aprovar
                  </button>
                  <button
                    onClick={() => rejectUser(user.id_utilizador)}
                    style={{ marginLeft: "0.5rem" }}
                  >
                    Rejeitar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
