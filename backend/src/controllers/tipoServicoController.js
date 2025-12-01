const TipoServicoModel = require("../models/tipoServicoModel");

const TipoServicoController = {

    list: async (req, res) => {
        try {
            const tipos = await TipoServicoModel.getAll();
            return res.json(tipos);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Error fetching service types" });
        }
    },

    create: async (req, res) => {
        try {
            const { tipoUser } = req.user;
            if (tipoUser !== 1) {
                return res.status(403).json({ error: "Only admin can create service types" });
            }

            const { designacao } = req.body;
            if (!designacao) {
                return res.status(400).json({ error: "Designacao is required" });
            }

            const novo = await TipoServicoModel.create(designacao);
            return res.status(201).json(novo);

        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Error creating service type" });
        }
    },

    delete: async (req, res) => {
        try {
            const { tipoUser } = req.user;
            if (tipoUser !== 1) {
                return res.status(403).json({ error: "Only admin can delete service types" });
            }

            const { id } = req.params;
            const deleted = await TipoServicoModel.delete(id);

            if (!deleted) {
                return res.status(404).json({ error: "Service type not found" });
            }

            return res.json({ message: "Service type deleted", deleted });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Error deleting service type" });
        }
    }
};

module.exports = TipoServicoController;
