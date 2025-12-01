const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AuthModel = require("../models/authModel");

const AuthController = {
    login: async (req, res) => {
        const { username, password } = req.body;

        try {
            // 1. Verificar se o utilizador existe
            const user = await AuthModel.findUserByUsername(username);

            if (!user) {
                return res.status(400).json({ error: "Invalid username or password" });
            }

            // 2. Verificar password
            const validPassword = await bcrypt.compare(password, user.password_hash);

            if (!validPassword) {
                return res.status(400).json({ error: "Invalid username or password" });
            }

            // 3. Identificar o perfil associado (proprietário ou empresa)
            let linkedProfile = null;

            const proprietario = await AuthModel.findProprietarioByUserId(user.id_utilizador);
            if (proprietario) {
                linkedProfile = {
                    role: "proprietario",
                    id: proprietario.id_proprietario
                };
            }

            const empresa = await AuthModel.findEmpresaByUserId(user.id_utilizador);
            if (empresa) {
                linkedProfile = {
                    role: "empresa",
                    id: empresa.id_empresa
                };
            }

            // 4. Construir payload do token
            const payload = {
                id: user.id_utilizador,
                username: user.username,
                tipoUser: user.id_tipouser,
                linkedProfile: linkedProfile
            };

            // 5. Gerar token
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRES
            });

            res.json({
                message: "Login successful",
                token: token,
                user: payload
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Server error during login" });
        }
    },

    register: async (req, res) => {
        const { nome, username, password, idTipoUser } = req.body;

        try {
            // 1. Verificar se username já existe
            const existingUser = await AuthModel.findUserByUsername(username);
            if (existingUser) {
                return res.status(400).json({ error: "Username already in use" });
            }

            // 2. Criar hash da password
            const passwordHash = await bcrypt.hash(password, 10);

            // 3. Criar utilizador na BD
            const newUser = await AuthModel.createUser(
                nome,
                username,
                passwordHash,
                idTipoUser
            );

            res.status(201).json({
                message: "User created successfully",
                user: {
                    id: newUser.id_utilizador,
                    nome: newUser.nome,
                    username: newUser.username,
                    tipoUser: newUser.id_tipouser
                }
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Server error during registration" });
        }
    }
};

module.exports = AuthController;
