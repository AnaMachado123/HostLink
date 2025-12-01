const ServicoModel = require("../models/servicoModel");

const ServicoController = {

    list: async (req, res) => {
        try {
            const { idTipoServico } = req.query;
            const servicos = await ServicoModel.getAll(idTipoServico);
            return res.json(servicos);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Error fetching services" });
        }
    },

    getById: async (req, res) => {
        try {
            const { id } = req.params;
            const servico = await ServicoModel.getById(id);
            if (!servico) {
                return res.status(404).json({ error: "Service not found" });
            }
            return res.json(servico);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Error fetching service" });
        }
    },

    create: async (req, res) => {
        try {
            const { tipoUser } = req.user;
            if (tipoUser !== 1) {
                return res.status(403).json({ error: "Only admin can create services" });
            }

            const { nome, descricao, valor, idTipoServico } = req.body;

            if (!nome || !idTipoServico) {
                return res.status(400).json({ error: "Nome and idTipoServico are required" });
            }

            const servico = await ServicoModel.create({
                nome,
                descricao,
                valor,
                idTipoServico
            });

            return res.status(201).json(servico);

        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Error creating service" });
        }
    },

    delete: async (req, res) => {
        try {
            const { tipoUser } = req.user;
            if (tipoUser !== 1) {
                return res.status(403).json({ error: "Only admin can delete services" });
            }

            const { id } = req.params;
            const deleted = await ServicoModel.delete(id);

            if (!deleted) {
                return res.status(404).json({ error: "Service not found" });
            }

            return res.json({ message: "Service deleted", deleted });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Error deleting service" });
        }
    }
};

module.exports = ServicoController;
