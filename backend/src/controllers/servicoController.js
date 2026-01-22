const ServicoModel = require("../models/servicoModel");
const EmpresaModel = require("../models/empresaModel");

/* =====================================================
   HELPERS
===================================================== */
async function resolveEmpresaId(req) {
  // caso normal (login antigo)
  if (req.user && req.user.id_empresa) {
    return req.user.id_empresa;
  }

  // caso login recente (empresa criada agora)
  if (req.user && req.user.id_utilizador) {
    const empresa = await EmpresaModel.findByUserId(
      req.user.id_utilizador
    );
    return empresa?.id_empresa || null;
  }

  return null;
}

/* =====================================================
   CONTROLLER
===================================================== */
const ServicoController = {

  // público
  listAllPublic: async (req, res) => {
    try {
      const servicos = await ServicoModel.getAllPublic();
      return res.json(servicos);
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        error: "Error fetching public services"
      });
    }
  },

  // empresa
  list: async (req, res) => {
    try {
      const idEmpresa = await resolveEmpresaId(req);

      if (!idEmpresa) {
        return res.status(403).json({
          error: "Company not found"
        });
      }

      const servicos =
        await ServicoModel.getAllByEmpresa(idEmpresa);

      return res.json(servicos);
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        error: "Error fetching services"
      });
    }
  },

  getById: async (req, res) => {
    try {
      const idEmpresa = await resolveEmpresaId(req);

      if (!idEmpresa) {
        return res.status(403).json({
          error: "Company not found"
        });
      }

      const servico =
        await ServicoModel.getByIdAndEmpresa(
          req.params.id,
          idEmpresa
        );

      if (!servico) {
        return res.status(404).json({
          error: "Service not found"
        });
      }

      return res.json(servico);
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        error: "Error fetching service"
      });
    }
  },

  create: async (req, res) => {
    try {
      const idEmpresa = await resolveEmpresaId(req);

      if (!idEmpresa) {
        return res.status(403).json({
          error: "Company not found"
        });
      }

      const servico = await ServicoModel.create({
        ...req.body,
        tipoPreco: req.body.tipo_preco,
        idEmpresa
      });

      return res.status(201).json(servico);
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        error: "Error creating service"
      });
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
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        error: "Error updating service"
      });
    }
  },

  delete: async (req, res) => {
    try {
      await ServicoModel.delete(req.params.id);
      return res.json({
        message: "Service deleted successfully"
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        error: "Error deleting service"
      });
    }
  }
};

module.exports = ServicoController;
