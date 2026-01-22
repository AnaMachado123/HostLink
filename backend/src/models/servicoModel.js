const pool = require("../config/db");

const ServicoModel = {

  // =========================
  // GET ALL BY EMPRESA
  // =========================
  getAllByEmpresa: async (idEmpresa) => {
    const result = await pool.query(
      `
      SELECT
        id_servico,
        nome,
        descricao,
        valor,
        tipo_preco,
        id_tiposervico,
        id_empresa
      FROM servico
      WHERE id_empresa = $1
      ORDER BY id_servico
      `,
      [idEmpresa]
    );

    return result.rows;
  },

  // =========================
  // 🔥 GET ALL (PUBLIC - PARA PEDIDOS)
  // =========================
  getAllPublic: async () => {
    const result = await pool.query(
      `
      SELECT
        s.id_servico,
        s.nome,
        s.descricao,
        s.valor,
        s.tipo_preco,
        s.id_tiposervico,
        s.id_empresa
      FROM servico s
      ORDER BY s.id_servico
      `
    );

    return result.rows;
  },

  // =========================
  // GET BY ID + EMPRESA
  // =========================
  getByIdAndEmpresa: async (idServico, idEmpresa) => {
    const result = await pool.query(
      `
      SELECT
        id_servico,
        nome,
        descricao,
        valor,
        tipo_preco,
        id_tiposervico,
        id_empresa
      FROM servico
      WHERE id_servico = $1
        AND id_empresa = $2
      `,
      [idServico, idEmpresa]
    );

    return result.rows[0];
  },

  // =========================
  // CREATE
  // =========================
  create: async ({
    nome,
    descricao,
    valor,
    idTipoServico,
    tipoPreco,
    idEmpresa
  }) => {
    const result = await pool.query(
      `
      INSERT INTO servico
        (nome, descricao, valor, id_tiposervico, tipo_preco, id_empresa)
      VALUES
        ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `,
      [nome, descricao, valor, idTipoServico, tipoPreco, idEmpresa]
    );

    return result.rows[0];
  },

  // =========================
  // UPDATE
  // =========================
  update: async ({
    id,
    nome,
    descricao,
    valor,
    idTipoServico,
    tipoPreco
  }) => {
    const result = await pool.query(
      `
      UPDATE servico
      SET
        nome = $1,
        descricao = $2,
        valor = $3,
        id_tiposervico = $4,
        tipo_preco = $5
      WHERE id_servico = $6
      RETURNING *
      `,
      [nome, descricao, valor, idTipoServico, tipoPreco, id]
    );

    return result.rows[0];
  },

  // =========================
  // DELETE
  // =========================
  delete: async (id) => {
    const result = await pool.query(
      `
      DELETE FROM servico
      WHERE id_servico = $1
      RETURNING *
      `,
      [id]
    );

    return result.rows[0];
  }
};

module.exports = ServicoModel;
