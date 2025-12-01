const pool = require("../config/db");

const AuthModel = {
    findUserByUsername: async (username) => {
        const query = 'SELECT * FROM Utilizador WHERE Username = $1';
        const result = await pool.query(query, [username]);
        return result.rows[0]; 
    },

    createUser: async (nome, username, passwordHash, idTipoUser) => {
        const query = `
            INSERT INTO Utilizador (Nome, Username, Password_Hash, Id_TipoUser)
            VALUES ($1, $2, $3, $4)
            RETURNING Id_Utilizador, Nome, Username, Id_TipoUser;
        `;
        const values = [nome, username, passwordHash, idTipoUser];
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    // Buscar perfil de proprietário
    findProprietarioByUserId: async (idUtilizador) => {
        const result = await pool.query(
            "SELECT id_proprietario FROM proprietario WHERE id_utilizador = $1",
            [idUtilizador]
        );
        return result.rows[0];
    },

    // Buscar perfil de empresa
    findEmpresaByUserId: async (idUtilizador) => {
        const result = await pool.query(
            "SELECT id_empresa FROM empresa WHERE id_utilizador = $1",
            [idUtilizador]
        );
        return result.rows[0];
    }
};

module.exports = AuthModel;
