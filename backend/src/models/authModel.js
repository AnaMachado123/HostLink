const pool = require("../config/db");

const AuthModel = {

  // -----------------------------------
  // FIND USER BY USERNAME (LOGIN)
  // -----------------------------------
  findUserByUsername: async (username) => {
    const query = "SELECT * FROM hostlink.utilizador WHERE username = $1";
    const result = await pool.query(query, [username]);
    return result.rows[0];
  },

  // -----------------------------------
  // CREATE USER (REGISTER)
  // -----------------------------------
  createUser: async (nome, username, passwordHash, idTipoUser, status) => {
  const query = `
    INSERT INTO hostlink.utilizador
      (nome, username, password_hash, id_tipouser, status)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id_utilizador, nome, username, id_tipouser, status;
  `;
  const values = [nome, username, passwordHash, idTipoUser, status];
  const result = await pool.query(query, values);
  return result.rows[0];
},


  // -----------------------------------
  // FIND USER BY ID (AUTH /me)
  // -----------------------------------
  findUserById: async (idUtilizador) => {
    const query = `
      SELECT id_utilizador, nome, username
      FROM hostlink.utilizador
      WHERE id_utilizador = $1
    `;
    const result = await pool.query(query, [idUtilizador]);
    return result.rows[0];
  },

  // -----------------------------------
  // PROPRIETARIO
  // -----------------------------------
  findProprietarioByUserId: async (idUtilizador) => {
    const result = await pool.query(
      "SELECT id_proprietario FROM hostlink.proprietario WHERE id_utilizador = $1",
      [idUtilizador]
    );
    return result.rows[0];
  },

  // -----------------------------------
  // EMPRESA
  // -----------------------------------
  findEmpresaByUserId: async (idUtilizador) => {
    const result = await pool.query(
      "SELECT id_empresa FROM hostlink.empresa WHERE id_utilizador = $1",
      [idUtilizador]
    );
    return result.rows[0];
  }

};

module.exports = AuthModel;
