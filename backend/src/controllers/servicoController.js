const ServicoModel = require("../models/servicoModel");

const ServicoController = {

  // 🔓 PÚBLICO — USADO NOS REQUESTS
  listAllPublic: async (req, res) => {
    try {
      const servicos = await ServicoModel.getAllPublic();
      return res.json(servicos);
    } catch (error) {
      console.error("LIST PUBLIC SERVICES ERROR:", error);
      return res.status(500).json({
        error: "Error fetching public services"
      });
    }
  },

  // 🔒 EMPRESA
  list: async (req, res) => {
    try {
      if (!req.user || !req.user.id_empresa) {
        return res.status(403).json({ error: "Access denied" });
      }

      const servicos = await ServicoModel.getAllByEmpresa(req.user.id_empresa);
      return res.json(servicos);

    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Error fetching services" });
    }
  },

  getById: async (req, res) => {
    try {
      const servico = await ServicoModel.getByIdAndEmpresa(
        req.params.id,
        req.user.id_empresa
      );

      if (!servico) {
        return res.status(404).json({ error: "Service not found" });
      }

      return res.json(servico);

    } catch (error) {
      return res.status(500).json({ error: "Error fetching service" });
    }
  },

  create: async (req, res) => {
    try {
      const servico = await ServicoModel.create({
        ...req.body,
        tipoPreco: req.body.tipo_preco,
        idEmpresa: req.user.id_empresa
      });

      return res.status(201).json(servico);

    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Error creating service" });
    }
  },

  update: async (req, res) => {
    try {
      const updated = await ServicoModel.update({
        id: req.params.id,
        ...req.body,
        tipoPreco: req.body.tipo_preco
      });

      return res.json(updated);

    } catch (error) {
      return res.status(500).json({ error: "Error updating service" });
    }
  },

  delete: async (req, res) => {
    try {
      await ServicoModel.delete(req.params.id);
      return res.json({ message: "Service deleted successfully" });

    } catch (error) {
      return res.status(500).json({ error: "Error deleting service" });
    }
  }
};

module.exports = ServicoController;
