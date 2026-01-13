const ProprietarioModel = require("../models/proprietarioModel");

const ProprietarioController = {

  // ===============================
  // CREATE OWNER PROFILE
  // ===============================
  createProfile: async (req, res) => {
    try {
      const { id_utilizador, role } = req.user;

      if (role !== "proprietario") {
        return res.status(403).json({
          error: "Only owner accounts can create a Proprietario profile"
        });
      }

      const { nome, email, telefone, nif } = req.body;

      if (!nome || !email) {
        return res.status(400).json({
          error: "Nome and Email are required"
        });
      }

      const existing = await ProprietarioModel.findByUserId(id_utilizador);
      if (existing) {
        return res.status(400).json({
          error: "Profile already exists"
        });
      }

      const proprietario = await ProprietarioModel.create({
        idUtilizador: id_utilizador,
        nome,
        email,
        telefone,
        nif
      });

      // 👇 atualização de status corretamente delegada ao model
      await ProprietarioModel.setUserPending(id_utilizador);

      return res.status(201).json({
        message: "Owner profile created",
        proprietario
      });

    } catch (err) {
      console.error("Owner createProfile error:", err);
      return res.status(500).json({
        error: "Error creating owner profile"
      });
    }
  },

  // ===============================
  // GET MY OWNER PROFILE
  // ===============================
  getMe: async (req, res) => {
    try {
      const { id_utilizador, role } = req.user;

      if (role !== "proprietario") {
        return res.status(403).json({
          error: "Only owner accounts can access this resource"
        });
      }

      const proprietario = await ProprietarioModel.findByUserId(id_utilizador);

      if (!proprietario) {
        return res.json({ exists: false });
      }

      return res.json({
        exists: true,
        proprietario
      });

    } catch (err) {
      console.error("Owner getMe error:", err);
      return res.status(500).json({
        error: "Error fetching owner profile"
      });
    }
  }
};

module.exports = ProprietarioController;
