const ProprietarioModel = require("../models/proprietarioModel");

const ProprietarioController = {
    // Criar perfil de proprietário para o utilizador autenticado
    createProfile: async (req, res) => {
        try {
            const { id, tipoUser } = req.user; // vem do token

            // Só tipoUser 2 (proprietário) pode criar este perfil
            if (tipoUser !== 2) {
                return res.status(403).json({ error: "Only owner accounts can create a Proprietario profile" });
            }

            const { nome, email, telefone, nif } = req.body;

            if (!nome || !email) {
                return res.status(400).json({ error: "Nome and Email are required" });
            }

            // Ver se já existe perfil
            const existing = await ProprietarioModel.findByUserId(id);
            if (existing) {
                return res.status(400).json({ error: "Profile already exists for this user" });
            }

            const novoProprietario = await ProprietarioModel.create({
                idUtilizador: id,
                nome,
                email,
                telefone,
                nif
            });

            return res.status(201).json({
                message: "Proprietario profile created successfully",
                proprietario: novoProprietario
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Error creating Proprietario profile" });
        }
    },

    // Obter perfil do proprietário autenticado
    getMyProfile: async (req, res) => {
        try {
            const { id, tipoUser } = req.user;

            if (tipoUser !== 2) {
                return res.status(403).json({ error: "Only owner accounts can access this resource" });
            }

            const proprietario = await ProprietarioModel.getByUserId(id);

            if (!proprietario) {
                return res.status(404).json({ error: "Proprietario profile not found" });
            }

            return res.json(proprietario);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Error fetching Proprietario profile" });
        }
    },

    // (Opcional) listar todos os proprietários – só para admin
    getAll: async (req, res) => {
        try {
            const { tipoUser } = req.user;

            if (tipoUser !== 1) {
                return res.status(403).json({ error: "Only admin can list all owners" });
            }

            const proprietarios = await ProprietarioModel.getAll();
            return res.json(proprietarios);

        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Error fetching owners" });
        }
    }
};

module.exports = ProprietarioController;
