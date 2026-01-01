const pool = require("../config/db");

// ===============================
// CRIAR FATURA
// ===============================
async function createFatura(idMetodoPagamento, valor, observacoes = null) {
  const result = await pool.query(
    `INSERT INTO fatura_recibo 
      (id_metodopagamento, valor, observacoes)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [idMetodoPagamento, valor, observacoes]
  );

  return result.rows[0];
}

// ===============================
// OBTER FATURA POR ID
// ===============================
async function getFaturaById(idFatura) {
  const result = await pool.query(
    `SELECT *
     FROM fatura_recibo
     WHERE id_fatura = $1`,
    [idFatura]
  );

  return result.rows[0];
}

// ===============================
// LISTAR TODAS AS FATURAS (ADMIN)
// ===============================
async function getAllFaturas() {
  const result = await pool.query(
    `SELECT *
     FROM fatura_recibo
     ORDER BY dt_emissao DESC`
  );

  return result.rows;
}

module.exports = {
  createFatura,
  getFaturaById,
  getAllFaturas
};
