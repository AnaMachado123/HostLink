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
      -- Serviços oferecidos
      (SELECT COUNT(*)
       FROM hostlink.servico s
       JOIN hostlink.empresa e ON e.id_empresa = s.id_empresa
       WHERE e.id_utilizador = $1
      ) AS servicos_oferecidos,

      -- Pedidos recebidos
      (SELECT COUNT(*)
       FROM hostlink.solicitarservico ss
       JOIN hostlink.servico s ON s.id_servico = ss.id_servico
       JOIN hostlink.empresa e ON e.id_empresa = s.id_empresa
       WHERE e.id_utilizador = $1
      ) AS pedidos_recebidos,

      -- Serviços concluídos (opcional / depende do teu fluxo)
      (SELECT COUNT(*)
       FROM hostlink.solicitarservico ss
       JOIN hostlink.servico s ON s.id_servico = ss.id_servico
       JOIN hostlink.empresa e ON e.id_empresa = s.id_empresa
       WHERE e.id_utilizador = $1
         AND ss.status = 'concluido'
      ) AS servicos_concluidos
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


exports.getAllInvoices = async () => {
  const result = await pool.query(`
    SELECT
      fr.id_fatura,
      fr.dt_emissao,
      fr.valor,
      fr.status,

      e.nome        AS empresa_nome,
      u.nome        AS cliente_nome,
      s.nome        AS servico_nome

    FROM hostlink.fatura_recibo fr

    JOIN hostlink.solicitarservico ss
      ON ss.id_solicitarservico = fr.id_solicitarservico

    JOIN hostlink.servico s
      ON s.id_servico = ss.id_servico

    JOIN hostlink.empresa e
      ON e.id_empresa = s.id_empresa

    JOIN hostlink.proprietario p
      ON p.id_proprietario = ss.id_proprietario

    JOIN hostlink.utilizador u
      ON u.id_utilizador = p.id_utilizador

    ORDER BY fr.dt_emissao DESC
  `);

  return result.rows;
};
