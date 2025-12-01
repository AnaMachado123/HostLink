const pool = require("../config/db");

const ProprietarioModel = {
    // Ver se já existe um perfil de proprietário para este utilizador
    findByUserId: async (idUtilizador) => {
        const query = `
            SELECT * 
            FROM Proprietario
            WHERE Id_Utilizador = $1
        `;
        const result = await pool.query(query, [idUtilizador]);
        return result.rows[0];
    },

    // Criar perfil de proprietário
    create: async ({ idUtilizador, nome, email, telefone, nif }) => {
        const query = `
            INSERT INTO Proprietario (Id_Utilizador, Nome, Email, Telefone, NIF)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;
        const values = [idUtilizador, nome, email, telefone, nif];
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    // Obter perfil por Id_Utilizador (para mostrar os dados no front)
    getByUserId: async (idUtilizador) => {
        const query = `
            SELECT * 
            FROM Proprietario
            WHERE Id_Utilizador = $1
        `;
        const result = await pool.query(query, [idUtilizador]);
        return result.rows[0];
    },

    // (Opcional) obter todos os proprietários – útil para o admin
    getAll: async () => {
        const query = `
            SELECT p.*, u.Username, u.Id_TipoUser
            FROM Proprietario p
            JOIN Utilizador u ON p.Id_Utilizador = u.Id_Utilizador
        `;
        const result = await pool.query(query);
        return result.rows;
    }
};

module.exports = ProprietarioModel;
