const pool = require("../config/db");

/* =====================================================
   CRIAR FATURA (LIGADA A UM PEDIDO)
===================================================== */
async function createFatura({
  valor,
  observacoes = null,
  id_solicitarservico
}) {
  const result = await pool.query(
    `
    INSERT INTO hostlink.fatura_recibo
      (valor, observacoes, id_solicitarservico, status)
    VALUES ($1, $2, $3, 'emitida')
    RETURNING *
    `,
    [valor, observacoes, id_solicitarservico]
  );

  return result.rows[0];
}

/* =====================================================
   OBTER FATURA POR ID
===================================================== */
async function getFaturaById(idFatura) {
  const result = await pool.query(
    `
    SELECT *
    FROM hostlink.fatura_recibo
    WHERE id_fatura = $1
    `,
    [idFatura]
  );

  return result.rows[0];
}

/* =====================================================
   OBTER FATURA ASSOCIADA A UM PEDIDO
   (evita duplicados)
===================================================== */
async function getFaturaByPedido(idSolicitarServico) {
  const result = await pool.query(
    `
    SELECT *
    FROM hostlink.fatura_recibo
    WHERE id_solicitarservico = $1
    `,
    [idSolicitarServico]
  );

  return result.rows[0];
}

/* =====================================================
   LISTAR FATURAS DO PROPRIETÁRIO
===================================================== */
async function getFaturasByProprietario(idUtilizador) {
  const result = await pool.query(
    `
    SELECT 
      fr.id_fatura,
      fr.valor,
      fr.dt_emissao,
      fr.status,
      fr.observacoes,
      fr.id_solicitarservico,
      s.data AS data_pedido,
      serv.nome AS servico_nome,
      i.nome AS nome_imovel
    FROM fatura_recibo fr
    JOIN solicitarservico s 
      ON s.id_solicitarservico = fr.id_solicitarservico
    JOIN proprietario p 
      ON p.id_proprietario = s.id_proprietario
    JOIN servico serv 
      ON serv.id_servico = s.id_servico
    LEFT JOIN imovel i 
      ON i.id_imovel = s.id_imovel
    WHERE p.id_utilizador = $1
    ORDER BY fr.dt_emissao DESC
    `,
    [idUtilizador]
  );

  return result.rows;
}


/* =====================================================
   LISTAR FATURAS DA EMPRESA
===================================================== */
async function getFaturasByEmpresa(idUtilizadorEmpresa) {
  const result = await pool.query(
    `
    SELECT
      f.id_fatura,
      f.valor,
      f.dt_emissao,
      f.status,
      f.id_solicitarservico,
      s.data AS request_date,
      serv.nome AS servico_nome,
      i.nome AS nome_imovel
    FROM hostlink.fatura_recibo f
    JOIN solicitarservico s ON s.id_solicitarservico = f.id_solicitarservico
    JOIN servico serv ON serv.id_servico = s.id_servico
    JOIN empresa e ON e.id_empresa = serv.id_empresa
    LEFT JOIN imovel i ON i.id_imovel = s.id_imovel
    WHERE e.id_utilizador = $1
    ORDER BY f.dt_emissao DESC
    `,
    [idUtilizadorEmpresa]
  );

  return result.rows;
}

module.exports = {
  createFatura,
  getFaturaById,
  getFaturaByPedido,
  getFaturasByProprietario,
  getFaturasByEmpresa
};
