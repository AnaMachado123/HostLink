const ImovelModel = require("../models/imovelModel");
const ProprietarioModel = require("../models/proprietarioModel");

const ImovelController = {
    create: async (req, res) => {
        try {
            const { tipoUser, id } = req.user;

            if (tipoUser !== 2) {
                return res.status(403).json({ error: "Only proprietarios can create imoveis" });
            }

            const proprietario = await ProprietarioModel.findByUserId(id);

            if (!proprietario) {
                return res.status(400).json({ error: "Proprietario profile not found" });
            }

            const {
                nome,
                capacidade,
                rua,
                nPorta,
                descricao,
                codPostal
            } = req.body;

            if (!nome) {
                return res.status(400).json({ error: "Nome is required" });
            }

            const imovel = await ImovelModel.create({
                idProprietario: proprietario.id_proprietario,
                nome,
                capacidade,
                rua,
                nPorta,
                descricao,
                codPostal
            });

            return res.status(201).json(imovel);

        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Error creating imovel" });
        }
    },

    getMyImoveis: async (req, res) => {
        try {
            const { tipoUser, id } = req.user;

            if (tipoUser !== 2) {
                return res.status(403).json({ error: "Only proprietarios can list their imoveis" });
            }

            const proprietario = await ProprietarioModel.findByUserId(id);

            if (!proprietario) {
                return res.status(400).json({ error: "Proprietario profile not found" });
            }

            const imoveis = await ImovelModel.getByOwner(proprietario.id_proprietario);
            return res.json(imoveis);

        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Error fetching imoveis" });
        }
    },

    getById: async (req, res) => {
        try {
            const { id } = req.params;
            const imovel = await ImovelModel.getById(id);

            if (!imovel) {
                return res.status(404).json({ error: "Imovel not found" });
            }

            return res.json(imovel);

        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Error fetching imovel" });
        }
    },

    getAll: async (req, res) => {
        try {
            const { tipoUser } = req.user;

            if (tipoUser !== 1) {
                return res.status(403).json({ error: "Only admin can list all imoveis" });
            }

            const imoveis = await ImovelModel.getAll();
            return res.json(imoveis);

        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Error fetching all imoveis" });
        }
    },

    update: async (req, res) => {
        try {
            const { id: userId, tipoUser } = req.user;
            const { id } = req.params;
            const fields = req.body;

            if (tipoUser !== 2) {
                return res.status(403).json({ error: "Only proprietarios can update" });
            }

            const proprietario = await ProprietarioModel.findByUserId(userId);

            const imovel = await ImovelModel.getById(id);

            if (!imovel) {
                return res.status(404).json({ error: "Imovel not found" });
            }

            if (imovel.id_proprietario !== proprietario.id_proprietario) {
                return res.status(403).json({ error: "You do not own this imovel" });
            }

            const updated = await ImovelModel.update(id, fields);
            return res.json(updated);

        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Error updating imovel" });
        }
    },

    delete: async (req, res) => {
        try {
            const { id: userId, tipoUser } = req.user;
            const { id } = req.params;

            if (tipoUser !== 2) {
                return res.status(403).json({ error: "Only proprietarios can delete" });
            }

            const proprietario = await ProprietarioModel.findByUserId(userId);

            const imovel = await ImovelModel.getById(id);

            if (!imovel) {
                return res.status(404).json({ error: "Imovel not found" });
            }

            if (imovel.id_proprietario !== proprietario.id_proprietario) {
                return res.status(403).json({ error: "You do not own this imovel" });
            }

            const deleted = await ImovelModel.delete(id);
            return res.json({ message: "Imovel deleted", deleted });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Error deleting imovel" });
        }
    }
};

module.exports = ImovelController;
