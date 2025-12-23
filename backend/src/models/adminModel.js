const pool = require("../config/db");

exports.getUsersByStatus = async (status) => {
  const result = await pool.query(
    `
    SELECT 
      u.id_utilizador,
      u.nome,
      u.username AS email,
      u.status,
      tu.designacao AS role
    FROM hostlink.utilizador u
    JOIN hostlink.tipouser tu ON tu.id_tipouser = u.id_tipouser
    WHERE u.status = $1
    `,
    [status]
  );
  return result.rows;
};

exports.getUserById = async (id) => {
  const result = await pool.query(
    `SELECT * FROM hostlink.utilizador WHERE id_utilizador = $1`,
    [id]
  );
  return result.rows[0];
};

exports.approveUser = async (id, token, expiresAt) => {
  await pool.query(
    `
    UPDATE hostlink.utilizador
    SET status = 'APPROVED',
        activation_token = $1,
        activation_token_expires_at = $2
    WHERE id_utilizador = $3
    `,
    [token, expiresAt, id]
  );
};

exports.rejectUser = async (id) => {
  await pool.query(
    `
    UPDATE hostlink.utilizador
    SET status = 'REJECTED'
    WHERE id_utilizador = $1
    `,
    [id]
  );
};
