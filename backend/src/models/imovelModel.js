const pool = require("../config/db");

const ImovelModel = {
    create: async ({
        idProprietario,
        nome,
        capacidade,
        rua,
        nPorta,
        descricao,
        codPostal
    }) => {
        const query = `
            INSERT INTO Imovel (
                Id_Proprietario, Nome, Capacidade, Rua, nPorta, Descricao, Cod_Postal
            )
            VALUES ($1,$2,$3,$4,$5,$6,$7)
            RETURNING *;
        `;

        const values = [
            idProprietario,
            nome,
            capacidade,
            rua,
            nPorta,
            descricao,
            codPostal
        ];

        const result = await pool.query(query, values);
        return result.rows[0];
    },

    getByOwner: async (idProprietario) => {
        const query = `
            SELECT *
            FROM Imovel
            WHERE Id_Proprietario = $1;
        `;
        const result = await pool.query(query, [idProprietario]);
        return result.rows;
    },

    getById: async (id) => {
        const query = `SELECT * FROM Imovel WHERE Id_Imovel = $1`;
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },

    getAll: async () => {
        const result = await pool.query(`SELECT * FROM Imovel`);
        return result.rows;
    },

    update: async (id, fields) => {
        const keys = Object.keys(fields);
        const values = Object.values(fields);

        if (keys.length === 0) return null;

        const set = keys.map((key, i) => `"${key}" = $${i + 1}`).join(", ");

        const query = `
            UPDATE Imovel 
            SET ${set}
            WHERE Id_Imovel = $${keys.length + 1}
            RETURNING *;
        `;

        values.push(id);

        const result = await pool.query(query, values);
        return result.rows[0];
    },

    delete: async (id) => {
        const query = `
            DELETE FROM Imovel 
            WHERE Id_Imovel = $1
            RETURNING *;
        `;

        const result = await pool.query(query, [id]);
        return result.rows[0];
    }
};

module.exports = ImovelModel;
