import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import styles from "./ManageUsers.module.css";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
  try {
    const response = await api.get("/admin/users");
    setUsers(response.data);
  } catch {
    setError("Erro ao carregar utilizadores.");
  } finally {
    setLoading(false);
  }
}


  async function approveUser(id) {
    if (!window.confirm("Aprovar esta conta?")) return;
    await api.post(`/admin/users/${id}/approve`);
    //setUsers(prev => prev.filter(u => u.id_utilizador !== id));
    setUsers(prev => prev.map(u => u.id_utilizador === id ? { ...u, status: "ACTIVE" } : u));

  }

  async function rejectUser(id) {
    if (!window.confirm("Rejeitar esta conta?")) return;
    await api.post(`/admin/users/${id}/reject`);
    //setUsers(prev => prev.filter(u => u.id_utilizador !== id));
    setUsers(prev => prev.map(u => u.id_utilizador === id ? { ...u, status: "REJECTED" } : u));

  }

  const filteredUsers = users.filter(user => {
    if (filter === "all") return true;
    return user.role === filter;
  });

  if (loading) return <p>A carregar...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h2>Pending accounts</h2>

        <select
          value={filter}
          onChange={e => setFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="empresa">Companies</option>
          <option value="proprietario">Owners</option>
        </select>
      </div>

      {filteredUsers.length === 0 ? (
        <p className={styles.empty}>No pending accounts</p>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>E-mail</th>
                <th>Type</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id_utilizador}>
                  <td
                    className={styles.link}
                    onClick={() =>
                      navigate(`/admin/users/${user.id_utilizador}`)
                    }
                  >
                    {user.nome}
                  </td>

                  <td>{user.email}</td>
                  <td className={styles.role}>{user.role}</td>

                  <td>
                    <span className={styles.badge}>
                      {user.status}
                    </span>
                  </td>

                  <td className={styles.actions}>
                    {user.status === "PENDING" && (
                      <>
                        <button
                          className={styles.approve}
                          onClick={() => approveUser(user.id_utilizador)}
                        >
                          Approve
                        </button>

                        <button
                          className={styles.reject}
                          onClick={() => rejectUser(user.id_utilizador)}
                        >
                          Refuse
                        </button>
                      </>
                    )}

                    {user.status === "ACTIVE" && (
                      <span className={styles.muted}>Active</span>
                    )}

                    {user.status === "REJECTED" && (
                      <span className={styles.muted}>Rejected</span>
                    )}
                  </td>   
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
