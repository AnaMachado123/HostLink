const pool = require("../config/db");

const EmpresaModel = {

    findByUserId: async (idUtilizador) => {
        const query = `
            SELECT * FROM Empresa 
            WHERE Id_Utilizador = $1
        `;
        const result = await pool.query(query, [idUtilizador]);
        return result.rows[0];
    },

    create: async ({
        idUtilizador,
        nome,
        email,
        telefone,
        nif,
        rua,
        nPorta,
        codPostal
    }) => {
        const query = `
            INSERT INTO Empresa (
                Id_Utilizador, Nome, Email, Telefone, NIF, Rua, nPorta, Cod_Postal
            ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
            RETURNING *;
        `;
        const values = [
            idUtilizador,
            nome,
            email,
            telefone,
            nif,
            rua,
            nPorta,
            codPostal
        ];

        const result = await pool.query(query, values);
        return result.rows[0];
    },

    getByUserId: async (idUtilizador) => {
        const query = `
            SELECT * FROM Empresa 
            WHERE Id_Utilizador = $1
        `;
        const result = await pool.query(query, [idUtilizador]);
        return result.rows[0];
    },

    getAll: async () => {
        const query = `
            SELECT e.*, u.Username 
            FROM Empresa e
            JOIN Utilizador u ON e.Id_Utilizador = u.Id_Utilizador
        `;
        const result = await pool.query(query);
        return result.rows;
    }
};

module.exports = EmpresaModel;
