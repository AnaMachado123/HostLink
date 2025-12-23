const pool = require("../config/db");

const AuthModel = {

  findUserByUsername: async (username) => {
    const query = 'SELECT * FROM hostlink.utilizador WHERE username = $1';
    const result = await pool.query(query, [username]);
    return result.rows[0];
  },

  createUser: async (nome, username, passwordHash, idTipoUser) => {
    const query = `
      INSERT INTO hostlink.utilizador (nome, username, password_hash, id_tipouser)
      VALUES ($1, $2, $3, $4)
      RETURNING id_utilizador, nome, username, id_tipouser;
    `;
    const values = [nome, username, passwordHash, idTipoUser];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  findProprietarioByUserId: async (idUtilizador) => {
    const result = await pool.query(
      "SELECT id_proprietario FROM hostlink.proprietario WHERE id_utilizador = $1",
      [idUtilizador]
    );
    return result.rows[0];
  },

  findEmpresaByUserId: async (idUtilizador) => {
    const result = await pool.query(
      "SELECT id_empresa FROM hostlink.empresa WHERE id_utilizador = $1",
      [idUtilizador]
    );
    return result.rows[0];
  }

};

module.exports = AuthModel;
