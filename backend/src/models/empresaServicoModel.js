const pool = require("../config/db");

const EmpresaServicoModel = {

    addServicoToEmpresa: async (idEmpresa, idServico) => {
        const result = await pool.query(
            `INSERT INTO EmpresaServico (Id_Empresa, Id_Servico)
             VALUES ($1,$2)
             ON CONFLICT (Id_Empresa, Id_Servico) DO NOTHING
             RETURNING *`,
            [idEmpresa, idServico]
        );
        return result.rows[0]; // pode ser undefined se já existir
    },

    getServicosDaEmpresa: async (idEmpresa) => {
        const result = await pool.query(
            `SELECT s.*
             FROM EmpresaServico es
             JOIN Servico s ON es.Id_Servico = s.Id_Servico
             WHERE es.Id_Empresa = $1`,
            [idEmpresa]
        );
        return result.rows;
    }
};

module.exports = EmpresaServicoModel;
