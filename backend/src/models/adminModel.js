const pool = require("../config/db");

exports.getUserById = async (id) => {
  const result = await pool.query(
    `
    SELECT 
      u.id_utilizador,
      u.nome,
      u.username AS email,
      u.status,
      tu.designacao AS role
    FROM hostlink.utilizador u
    JOIN hostlink.tipouser tu ON tu.id_tipouser = u.id_tipouser
    WHERE u.id_utilizador = $1
    `,
    [id]
  );
  return result.rows[0];
};

exports.getPendingUsers = async () => {
  const result = await pool.query(`
    SELECT 
      u.id_utilizador,
      u.nome,
      u.username AS email,
      u.status,
      tu.designacao AS role
    FROM hostlink.utilizador u
    JOIN hostlink.tipouser tu ON tu.id_tipouser = u.id_tipouser
    WHERE u.status = 'PENDING'
      AND tu.designacao IN ('empresa', 'proprietario')
  `);

  return result.rows;
};

exports.approveUser = async (id, token, expiresAt) => {
  await pool.query(
    `
    UPDATE hostlink.utilizador
    SET status = 'ACTIVE',
        activation_token = $1,
        activation_token_expires_at = $2
    WHERE id_utilizador = $3
    `,
    [token, expiresAt, id]
  );
};

exports.rejectUser = async (id) => {
  await pool.query(
    `
    UPDATE hostlink.utilizador
    SET status = 'REJECTED'
    WHERE id_utilizador = $1
    `,
    [id]
  );
};

exports.getAllUsers = async () => {
  const result = await pool.query(`
    SELECT 
      u.id_utilizador,
      u.nome,
      u.username AS email,
      u.status,
      tu.designacao AS role
    FROM hostlink.utilizador u
    JOIN hostlink.tipouser tu ON tu.id_tipouser = u.id_tipouser
    WHERE tu.designacao IN ('empresa', 'proprietario')
    ORDER BY u.id_utilizador DESC
  `);

  return result.rows;
};

exports.getOwnerHistory = async (userId) => {
  const result = await pool.query(`
    SELECT
      (SELECT COUNT(*) 
       FROM hostlink.imovel i
       JOIN hostlink.proprietario p ON p.id_proprietario = i.id_proprietario
       WHERE p.id_utilizador = $1) AS total_imoveis,

      (SELECT COUNT(*)
       FROM hostlink.solicitarservico s
       JOIN hostlink.proprietario p ON p.id_proprietario = s.id_proprietario
       WHERE p.id_utilizador = $1) AS total_pedidos,

      (SELECT MAX(s.data)
       FROM hostlink.solicitarservico s
       JOIN hostlink.proprietario p ON p.id_proprietario = s.id_proprietario
       WHERE p.id_utilizador = $1) AS ultima_atividade
  `, [userId]);

  return result.rows[0];
};

exports.getCompanyHistory = async (userId) => {
  const result = await pool.query(`
    SELECT
      (SELECT COUNT(*)
       FROM hostlink.empresaservico es
       JOIN hostlink.empresa e ON e.id_empresa = es.id_empresa
       WHERE e.id_utilizador = $1) AS servicos_oferecidos,

      (SELECT COUNT(*)
       FROM hostlink.solicitarservico s
       JOIN hostlink.servicopedido sp ON sp.id_solicitarservico = s.id_solicitarservico
       JOIN hostlink.servico se ON se.id_servico = sp.id_servico
       JOIN hostlink.empresaservico es ON es.id_servico = se.id_servico
       JOIN hostlink.empresa e ON e.id_empresa = es.id_empresa
       WHERE e.id_utilizador = $1) AS pedidos_recebidos,

      (SELECT COUNT(*)
       FROM hostlink.servicoexecutado sx
       JOIN hostlink.funcionarios f ON f.id_funcionario = sx.id_funcionario
       JOIN hostlink.empresa e ON e.id_empresa = f.id_empresa
       WHERE e.id_utilizador = $1) AS servicos_concluidos
  `, [userId]);

  return result.rows[0];
};

exports.getAdminStats = async () => {
  const result = await pool.query(`
    SELECT
      (SELECT COUNT(*) FROM hostlink.utilizador) AS total_users,

      (SELECT COUNT(*)
       FROM hostlink.utilizador u
       JOIN hostlink.tipouser tu ON tu.id_tipouser = u.id_tipouser
       WHERE tu.designacao = 'empresa'
         AND u.status = 'ACTIVE') AS active_companies,

      (SELECT COUNT(*)
       FROM hostlink.utilizador u
       JOIN hostlink.tipouser tu ON tu.id_tipouser = u.id_tipouser
       WHERE tu.designacao = 'proprietario'
         AND u.status = 'ACTIVE') AS active_owners,

      (SELECT COUNT(*)
       FROM hostlink.solicitarservico
       WHERE status = 'pendente') AS pending_requests,

      (SELECT COUNT(*)
       FROM hostlink.servicoexecutado) AS completed_services
  `);

  return result.rows[0];
};

