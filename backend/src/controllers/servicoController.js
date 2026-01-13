const ServicoModel = require("../models/servicoModel");

const ServicoController = {

  // =========================
  // LIST
  // =========================
  list: async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const idEmpresa = req.user.id_empresa;
      const servicos = await ServicoModel.getAllByEmpresa(idEmpresa);

      return res.json(servicos);

    } catch (error) {
      return res.status(500).json({ error: "Error fetching services" });
    }
  },

  // =========================
  // GET BY ID
  // =========================
  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const idEmpresa = req.user.id_empresa;

      const servico = await ServicoModel.getByIdAndEmpresa(id, idEmpresa);

      if (!servico) {
        return res.status(404).json({ error: "Service not found" });
      }

      return res.json(servico);

    } catch (error) {
      return res.status(500).json({ error: "Error fetching service" });
    }
  },

  // =========================
  // CREATE
  // =========================
  create: async (req, res) => {
    try {
      const idEmpresa = req.user.id_empresa;

      const {
        nome,
        descricao,
        valor,
        idTipoServico,
        tipo_preco
      } = req.body;

      if (!nome || !valor || !idTipoServico || !tipo_preco) {
        return res.status(400).json({
          error: "Missing required fields"
        });
      }

      const servico = await ServicoModel.create({
        nome,
        descricao,
        valor,
        idTipoServico,
        tipoPreco: tipo_preco,
        idEmpresa
      });

      return res.status(201).json(servico);

    } catch (error) {
      return res.status(500).json({ error: "Error creating service" });
    }
  },

  // =========================
  // UPDATE
  // =========================
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const idEmpresa = req.user.id_empresa;

      const existing = await ServicoModel.getByIdAndEmpresa(id, idEmpresa);
      if (!existing) {
        return res.status(403).json({
          error: "You are not allowed to update this service"
        });
      }

      const {
        nome,
        descricao,
        valor,
        idTipoServico,
        tipo_preco
      } = req.body;

      const updated = await ServicoModel.update({
        id,
        nome,
        descricao,
        valor,
        idTipoServico,
        tipoPreco: tipo_preco
      });

      return res.json(updated);

    } catch (error) {
      return res.status(500).json({ error: "Error updating service" });
    }
  },

  // =========================
  // DELETE
  // =========================
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const idEmpresa = req.user.id_empresa;

      const existing = await ServicoModel.getByIdAndEmpresa(id, idEmpresa);
      if (!existing) {
        return res.status(403).json({
          error: "You are not allowed to delete this service"
        });
      }

      await ServicoModel.delete(id);
      return res.json({ message: "Service deleted successfully" });

    } catch (error) {
      return res.status(500).json({ error: "Error deleting service" });
    }
  }
};

module.exports = ServicoController;
