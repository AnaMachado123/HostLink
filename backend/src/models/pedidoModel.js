const pool = require("../config/db");

/* =====================================================
   CONFLITO (MESMO SERVIÇO + MESMA DATA)
===================================================== */

  async function hasConflict({ idProprietario, idServico, data }) {
  const result = await pool.query(
    `
    SELECT 1
    FROM solicitarservico
    WHERE id_proprietario = $1
      AND id_servico = $2
      AND data = $3
      AND status IN ('pendente', 'agendado', 'andamento')
    LIMIT 1
    `,
    [idProprietario, idServico, data]
  );

  return result.rowCount > 0;
}


/* =====================================================
   CRIAR PEDIDO
===================================================== */
async function createPedido({
  idProprietario,
  idServico,
  idImovel,
  descricao,
  valor,
  comissao,
  data
}) {
  const result = await pool.query(
    `
    INSERT INTO solicitarservico
      (id_proprietario, id_servico, id_imovel, descricao, valor, comissao, data, status)
    VALUES
      ($1, $2, $3, $4, $5, $6, $7, 'pendente')
    RETURNING *
    `,
    [idProprietario, idServico, idImovel, descricao, valor, comissao, data]
  );

  return result.rows[0];
}

/* =====================================================
   PEDIDOS DO PROPRIETÁRIO
===================================================== */
async function getPedidosByProprietario(idProprietario) {
  const result = await pool.query(
    `
    SELECT 
      s.id_solicitarservico,
      s.data,
      s.status,
      s.valor,
      s.comissao,
      s.descricao,
      serv.nome AS servico_nome,
      i.nome AS nome_imovel,
      TO_CHAR(s.data, 'YYYY-MM-DD') AS data_formatada
    FROM solicitarservico s
    JOIN servico serv ON serv.id_servico = s.id_servico
    LEFT JOIN imovel i ON i.id_imovel = s.id_imovel
    WHERE s.id_proprietario = $1
    ORDER BY s.data DESC
    `,
    [idProprietario]
  );

  return result.rows;
}

/* =====================================================
   PEDIDOS DA EMPRESA
===================================================== */
async function getPedidosByEmpresa(idUtilizadorEmpresa) {
  const result = await pool.query(
    `
    SELECT
      s.id_solicitarservico,
      s.data,
      s.status,
      s.valor,
      s.comissao,
      s.descricao,
      serv.nome AS servico_nome,
      i.nome AS nome_imovel,
      TO_CHAR(s.data, 'YYYY-MM-DD') AS data_formatada
    FROM solicitarservico s
    JOIN servico serv ON serv.id_servico = s.id_servico
    JOIN empresa e ON e.id_empresa = serv.id_empresa
    LEFT JOIN imovel i ON i.id_imovel = s.id_imovel
    WHERE e.id_utilizador = $1
    ORDER BY s.data DESC
    `,
    [idUtilizadorEmpresa]
  );

  return result.rows;
}

/* =====================================================
   OBTER PEDIDO POR ID  ✅ (IMPORTANTE PARA FATURAS)
===================================================== */
async function getPedidoById(idPedido) {
  const result = await pool.query(
    `
    SELECT
      s.id_solicitarservico,
      s.status,                 -- 🔑 ESSENCIAL
      s.valor,
      s.comissao,
      s.descricao,
      s.data,
      serv.nome AS servico_nome,
      i.nome AS nome_imovel
    FROM solicitarservico s
    JOIN servico serv ON serv.id_servico = s.id_servico
    LEFT JOIN imovel i ON i.id_imovel = s.id_imovel
    WHERE s.id_solicitarservico = $1
    `,
    [idPedido]
  );

  return result.rows[0];
}

/* =====================================================
   ATUALIZAR ESTADO DO PEDIDO
===================================================== */
async function updatePedidoStatus(idPedido, novoEstado) {
  const result = await pool.query(
    `
    UPDATE solicitarservico
    SET status = $1
    WHERE id_solicitarservico = $2
    RETURNING *
    `,
    [novoEstado, idPedido]
  );

  return result.rows[0];
}

/* =====================================================
   AUX
===================================================== */
async function getServicoById(idServico) {
  const result = await pool.query(
    `SELECT * FROM servico WHERE id_servico = $1`,
    [idServico]
  );
  return result.rows[0];
}

async function getProprietarioByUserId(idUtilizador) {
  const result = await pool.query(
    `
    SELECT id_proprietario
    FROM proprietario
    WHERE id_utilizador = $1
    `,
    [idUtilizador]
  );

  return result.rows[0];
}

module.exports = {
  createPedido,
  hasConflict,
  getPedidosByProprietario,
  getPedidosByEmpresa,
  getPedidoById,          // 👈 NOVO / CORRIGIDO
  updatePedidoStatus,
  getServicoById,
  getProprietarioByUserId
};
