const pool = require("../config/db");

// ===============================
// CRIAR LINHA DE FATURA
// ===============================
async function createLinhaFatura(
  idFatura,
  quantidade,
  valor,
  idServicoExecutado
) {
  const result = await pool.query(
    `INSERT INTO linhafatura
      (id_fatura, qtd_linhas, valor, id_servicoexecutado)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [idFatura, quantidade, valor, idServicoExecutado]
  );

  return result.rows[0];
}

// ===============================
// OBTER LINHAS DE UMA FATURA
// ===============================
async function getLinhasByFatura(idFatura) {
  const result = await pool.query(
    `SELECT *
     FROM linhafatura
     WHERE id_fatura = $1`,
    [idFatura]
  );

  return result.rows;
}

module.exports = {
  createLinhaFatura,
  getLinhasByFatura
};
