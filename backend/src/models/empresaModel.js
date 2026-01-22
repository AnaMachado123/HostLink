const pool = require("../config/db");

const EmpresaModel = {

  // =======================================
  // GARANTE QUE O CÓDIGO POSTAL EXISTE
  // =======================================
  ensureCodigoPostalExists: async (codPostal, location) => {
    const exists = await pool.query(
      "SELECT cod_postal FROM codpostal WHERE cod_postal = $1",
      [codPostal]
    );

    if (exists.rows.length === 0) {
      await pool.query(
        `
        INSERT INTO codpostal (cod_postal, localidade)
        VALUES ($1, $2)
        `,
        [codPostal, location]
      );
    }
  },
  findByUserId: async (idUtilizador) => {
    const query = `
      SELECT 
        e.id_utilizador,
        e.nome,
        e.email,
        e.telefone,
        e.nif,
        e.rua,
        e.nporta,
        e.cod_postal,
        cp.localidade AS location
      FROM empresa e
      LEFT JOIN codpostal cp
        ON e.cod_postal = cp.cod_postal
      WHERE e.id_utilizador = $1
    `;

    const result = await pool.query(query, [idUtilizador]);
    return result.rows[0];
  },

  // =======================================
  // CREATE EMPRESA
  // =======================================
  create: async ({
    idUtilizador,
    nome,
    email,
    telefone,
    nif,
    rua,
    nPorta,
    codPostal
  }) => {
    const query = `
      INSERT INTO Empresa (
        Id_Utilizador,
        Nome,
        Email,
        Telefone,
        NIF,
        Rua,
        nPorta,
        Cod_Postal
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING *;
    `;

    const values = [
      idUtilizador,
      nome,
      email,
      telefone,
      nif,
      rua,
      nPorta,
      codPostal
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  // =======================================
  // GET ALL EMPRESAS (ADMIN)
  // =======================================
  getAll: async () => {
    const query = `
      SELECT e.*, u.Username
      FROM Empresa e
      JOIN Utilizador u ON e.Id_Utilizador = u.Id_Utilizador
    `;
    const result = await pool.query(query);
    return result.rows;
  },

  // =======================================
  // UPDATE USER STATUS (ADMIN)
  // =======================================
  updateUserStatus: async (idUtilizador, status) => {
    const query = `
      UPDATE Utilizador
      SET Account_Status = $1
      WHERE Id_Utilizador = $2
    `;
    await pool.query(query, [status, idUtilizador]);
  }
};

module.exports = EmpresaModel;
