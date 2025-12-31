const pool = require("../config/db");

const ProprietarioModel = {

  findByUserId: async (idUtilizador) => {
    const result = await pool.query(
      `
      SELECT *
      FROM proprietario
      WHERE id_utilizador = $1
      `,
      [idUtilizador]
    );
    return result.rows[0];
  },

  create: async ({ idUtilizador, nome, email, telefone, nif }) => {
    const result = await pool.query(
      `
      INSERT INTO proprietario
        (id_utilizador, nome, email, telefone, nif, status)
      VALUES
        ($1, $2, $3, $4, $5, 'pending')
      RETURNING *;
      `,
      [idUtilizador, nome, email, telefone, nif]
    );

    return result.rows[0];
  }
};

module.exports = ProprietarioModel;
