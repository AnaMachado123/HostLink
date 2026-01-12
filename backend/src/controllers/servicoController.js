const ServicoModel = require("../models/servicoModel");

const ServicoController = {

  // =========================
  // LIST (DEBUG SIMPLES)
  // =========================
  list: async (req, res) => {
    try {
      console.log("🔥 ENTROU NO CONTROLLER: GET /servicos");

      console.log("REQ.USER:", req.user);

      if (!req.user) {
        console.log("❌ req.user é undefined");
        return res.status(401).json({ error: "Unauthorized" });
      }

      const idEmpresa = req.user.id_empresa;
      console.log("ID_EMPRESA:", idEmpresa);

      const servicos = await ServicoModel.getAllByEmpresa(idEmpresa);

      console.log("SERVICOS DA BD:", servicos);

      return res.json(servicos);

    } catch (error) {
      console.error("❌ ERRO NO LIST:", error);
      return res.status(500).json({ error: "Error fetching services" });
    }
  },

  // =========================
  // GET BY ID
  // =========================
  getById: async (req, res) => {
    try {
      console.log("🔥 ENTROU NO CONTROLLER: GET /servicos/:id");

      const { id } = req.params;
      const idEmpresa = req.user.id_empresa;

      const servico = await ServicoModel.getByIdAndEmpresa(id, idEmpresa);

      if (!servico) {
        return res.status(404).json({ error: "Service not found" });
      }

      return res.json(servico);

    } catch (error) {
      console.error("❌ ERRO GET BY ID:", error);
      return res.status(500).json({ error: "Error fetching service" });
    }
  },

  // =========================
  // CREATE
  // =========================
  create: async (req, res) => {
    try {
      console.log("🔥 ENTROU NO CONTROLLER: POST /servicos");

      const idEmpresa = req.user.id_empresa;

      const {
        nome,
        descricao,
        valor,
        idTipoServico,
        tipo_preco
      } = req.body;

      const servico = await ServicoModel.create({
        nome,
        descricao,
        valor,
        idTipoServico,
        tipoPreco: tipo_preco,
        idEmpresa
      });

      console.log("SERVICO CRIADO:", servico);

      return res.status(201).json(servico);

    } catch (error) {
      console.error("❌ ERRO CREATE:", error);
      return res.status(500).json({ error: "Error creating service" });
    }
  },

  // =========================
  // UPDATE
  // =========================
  update: async (req, res) => {
    try {
      console.log("🔥 ENTROU NO CONTROLLER: PATCH /servicos/:id");

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
      console.error("❌ ERRO UPDATE:", error);
      return res.status(500).json({ error: "Error updating service" });
    }
  },

  // =========================
  // DELETE
  // =========================
  delete: async (req, res) => {
    try {
      console.log("🔥 ENTROU NO CONTROLLER: DELETE /servicos/:id");

      const { id } = req.params;
      const idEmpresa = req.user.id_empresa;

      const existing = await ServicoModel.getByIdAndEmpresa(id, idEmpresa);
      if (!existing) {
        return res.status(403).json({
          error: "You are not allowed to delete this service"
        });
      }

      await ServicoModel.delete(id);
      console.log("SERVICO APAGADO");

      return res.json({ message: "Service deleted successfully" });

    } catch (error) {
      console.error("❌ ERRO DELETE:", error);
      return res.status(500).json({ error: "Error deleting service" });
    }
  }
};

module.exports = ServicoController;
