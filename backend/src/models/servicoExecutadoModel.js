const pool = require("../config/db");

async function createServicoExecutado(idServico, idFuncionario, descricao) {
  const result = await pool.query(
    `INSERT INTO servicoexecutado (id_servico, id_funcionario, descricao)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [idServico, idFuncionario, descricao]
  );
  return result.rows[0];
}

async function getServicosExecutados() {
  const result = await pool.query(
    `SELECT 
        se.*,
        s.nome AS nome_servico,
        f.nome AS nome_funcionario
     FROM servicoexecutado se
     JOIN servico s ON s.id_servico = se.id_servico
     JOIN funcionarios f ON f.id_funcionario = se.id_funcionario
     ORDER BY se.dataservico DESC`
  );
  return result.rows;
}

module.exports = {
  createServicoExecutado,
  getServicosExecutados
};
