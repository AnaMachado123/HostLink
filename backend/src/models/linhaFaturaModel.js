const pool = require("../config/db");

/* =====================================================
   CRIAR LINHA DE FATURA (1 LINHA = 1 SERVIÇO)
===================================================== */
async function createLinhaFatura({
  idFatura,
  valor,
  idServicoExecutado
}) {
  const result = await pool.query(
    `
    INSERT INTO linhafatura
      (id_fatura, qtd_linhas, valor, id_servicoexecutado)
    VALUES
      ($1, 1, $2, $3)
    RETURNING *
    `,
    [idFatura, valor, idServicoExecutado]
  );

  return result.rows[0];
}

/* =====================================================
   OBTER LINHAS DE UMA FATURA
===================================================== */
async function getLinhasByFatura(idFatura) {
  const result = await pool.query(
    `
    SELECT *
    FROM linhafatura
    WHERE id_fatura = $1
    `,
    [idFatura]
  );

  return result.rows;
}

module.exports = {
  createLinhaFatura,
  getLinhasByFatura
};
