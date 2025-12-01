const pool = require("../config/db");

const ServicoModel = {

    getAll: async (idTipoServico) => {
        let query = "SELECT * FROM Servico";
        const params = [];

        if (idTipoServico) {
            query += " WHERE Id_TipoServico = $1";
            params.push(idTipoServico);
        }

        query += " ORDER BY Id_Servico";

        const result = await pool.query(query, params);
        return result.rows;
    },

    getById: async (id) => {
        const result = await pool.query(
            "SELECT * FROM Servico WHERE Id_Servico = $1",
            [id]
        );
        return result.rows[0];
    },

    create: async ({ nome, descricao, valor, idTipoServico }) => {
        const result = await pool.query(
            `INSERT INTO Servico (Nome, Descricao, Valor, Id_TipoServico)
             VALUES ($1,$2,$3,$4)
             RETURNING *`,
            [nome, descricao, valor, idTipoServico]
        );
        return result.rows[0];
    },

    delete: async (id) => {
        const result = await pool.query(
            "DELETE FROM Servico WHERE Id_Servico = $1 RETURNING *",
            [id]
        );
        return result.rows[0];
    }
};

module.exports = ServicoModel;
