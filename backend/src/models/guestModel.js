const pool = require("../config/db");

const GuestModel = {

  // ===============================
  // GET GUEST BY EMAIL
  // ===============================
  findByEmail: async (email) => {
    const result = await pool.query(
      `
      SELECT *
      FROM guest
      WHERE email = $1
      `,
      [email]
    );

    return result.rows[0];
  },

  // ===============================
  // CREATE GUEST PROFILE
  // ===============================
  create: async ({ nome, email, telefone, nif }) => {
    const result = await pool.query(
      `
      INSERT INTO guest (nome, email, telefone, nif)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [nome, email, telefone, nif || null]
    );

    return result.rows[0];
  }
};

module.exports = GuestModel;
