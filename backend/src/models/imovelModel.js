const pool = require("../config/db");

const ImovelModel = {
  /* ================= CREATE ================= */
  create: async ({
    id_proprietario,
    nome,
    capacidade,
    rua,
    nporta,
    descricao,
    cod_postal,
    imagem
  }) => {
    if (!id_proprietario) {
      throw new Error("id_proprietario is missing");
    }

    const query = `
      INSERT INTO imovel
        (id_proprietario, nome, capacidade, rua, nporta, descricao, cod_postal, imagem)
      VALUES
        ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING *;
    `;

    const values = [
      id_proprietario,
      nome,
      capacidade,
      rua,
      nporta,
      descricao,
      cod_postal,
      imagem
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  /* ================= GET BY OWNER ================= */
  getByOwner: async (id_proprietario) => {
    const query = `
      SELECT *
      FROM imovel
      WHERE id_proprietario = $1
      ORDER BY id_imovel DESC;
    `;

    const result = await pool.query(query, [id_proprietario]);
    return result.rows;
  },

  /* ================= GET BY ID ================= */
  getById: async (id_imovel) => {
    const query = `
      SELECT 
        i.*,
        c.localidade
      FROM imovel i
      LEFT JOIN codpostal c 
        ON i.cod_postal = c.cod_postal
      WHERE i.id_imovel = $1;
    `;

    const result = await pool.query(query, [id_imovel]);
    return result.rows[0];
  }, // 🔴 ESTA VÍRGULA É O QUE ESTAVA A FALTAR

  /* ================= UPDATE ================= */
  update: async (id_imovel, data) => {
    const allowedFields = [
      "nome",
      "capacidade",
      "rua",
      "nporta",
      "descricao",
      "cod_postal",
      "imagem"
    ];

    const keys = Object.keys(data).filter((k) =>
      allowedFields.includes(k)
    );

    if (keys.length === 0) return null;

    const values = [];
    const setClause = keys
      .map((key, i) => {
        values.push(data[key]);
        return `${key} = $${i + 1}`;
      })
      .join(", ");

    values.push(id_imovel);

    const query = `
      UPDATE imovel
      SET ${setClause}
      WHERE id_imovel = $${values.length}
      RETURNING *;
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  /* ================= DELETE ================= */
  delete: async (id_imovel) => {
    const result = await pool.query(
      "DELETE FROM imovel WHERE id_imovel = $1 RETURNING *",
      [id_imovel]
    );
    return result.rows[0];
  }
};

module.exports = ImovelModel;
