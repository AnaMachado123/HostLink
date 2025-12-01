const pool = require("../config/db");

const TipoServicoModel = {
    getAll: async () => {
        const result = await pool.query("SELECT * FROM TipoServico ORDER BY Id_TipoServico");
        return result.rows;
    },

    getById: async (id) => {
        const result = await pool.query(
            "SELECT * FROM TipoServico WHERE Id_TipoServico = $1",
            [id]
        );
        return result.rows[0];
    },

    create: async (designacao) => {
        const result = await pool.query(
            "INSERT INTO TipoServico (Designacao) VALUES ($1) RETURNING *",
            [designacao]
        );
        return result.rows[0];
    },

    delete: async (id) => {
        const result = await pool.query(
            "DELETE FROM TipoServico WHERE Id_TipoServico = $1 RETURNING *",
            [id]
        );
        return result.rows[0];
    }
};

module.exports = TipoServicoModel;
