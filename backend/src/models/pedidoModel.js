const pool = require("../config/db");

// Criar pedido principal
async function createPedido(idProprietario, descricao, valor, comissao) {
  const result = await pool.query(
    `INSERT INTO solicitarservico (id_proprietario, descricao, valor, comissao)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [idProprietario, descricao, valor, comissao]
  );
  return result.rows[0];
}

// Associar serviços ao pedido
async function addServicosToPedido(idPedido, servicoIds) {
  for (const idServico of servicoIds) {
    await pool.query(
      `INSERT INTO servicoPedido (id_solicitarservico, id_servico)
       VALUES ($1, $2)`,
      [idPedido, idServico]
    );
  }
}

// Buscar pedidos do proprietário
async function getPedidosByProprietario(idProprietario) {
  const result = await pool.query(
    `SELECT 
        s.*,
        TO_CHAR(s.data, 'YYYY-MM-DD') AS data_formatada
     FROM solicitarservico s
     WHERE s.id_proprietario = $1
     ORDER BY s.data DESC`,
    [idProprietario]
  );

  return result.rows;
}

// Buscar serviços de um pedido
async function getServicosDoPedido(idPedido) {
  const result = await pool.query(
    `SELECT sp.id_servico, serv.nome
     FROM servicoPedido sp
     JOIN servico serv ON serv.id_servico = sp.id_servico
     WHERE sp.id_solicitarservico = $1`,
    [idPedido]
  );

  return result.rows;
}

// Listar todos os pedidos (ADMIN)
async function getAllPedidos() {
  const result = await pool.query(
    `SELECT 
        s.*,
        TO_CHAR(s.data, 'YYYY-MM-DD') AS data_formatada
     FROM solicitarservico s
     ORDER BY s.data DESC`
  );
  return result.rows;
}

// Buscar um pedido pelo ID
async function getPedidoById(idPedido) {
  const result = await pool.query(
    `SELECT 
        s.*,
        TO_CHAR(s.data, 'YYYY-MM-DD') AS data_formatada
     FROM solicitarservico s
     WHERE s.id_solicitarservico = $1`,
    [idPedido]
  );

  return result.rows[0];
}

// Atualizar estado do pedido
async function updatePedidoStatus(idPedido, novoEstado) {
  const result = await pool.query(
    `UPDATE solicitarservico
     SET status = $1
     WHERE id_solicitarservico = $2
     RETURNING *`,
    [novoEstado, idPedido]
  );

  return result.rows[0];
}

module.exports = {
  createPedido,
  addServicosToPedido,
  getPedidosByProprietario,
  getServicosDoPedido,
  getAllPedidos,
  getPedidoById,
  updatePedidoStatus
};
