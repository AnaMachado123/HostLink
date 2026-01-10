const EmpresaModel = require("../models/empresaModel");

const EmpresaController = {

  // =======================================
  // CREATE COMPANY PROFILE
  // =======================================
  createProfile: async (req, res) => {
    try {
      const { id_utilizador, role } = req.user;

      if (role !== "empresa") {
        return res.status(403).json({
          error: "Only company accounts can create a company profile"
        });
      }

      const {
        nome_empresa,
        email,
        telefone,
        nif,
        rua,
        numero,
        codigo_postal,
        location
      } = req.body;

      // --------- validações ----------
      if (
        !nome_empresa ||
        !email ||
        !telefone ||
        !nif ||
        !codigo_postal ||
        !location
      ) {
        return res.status(400).json({
          error: "Missing required fields"
        });
      }

      if (!/^\d{9}$/.test(nif)) {
        return res.status(400).json({
          error: "NIF must have exactly 9 digits"
        });
      }

      // garante código postal + location
      await EmpresaModel.ensureCodigoPostalExists(
        codigo_postal,
        location
      );

      // 🔥 CRIA A EMPRESA (COM location)
      const empresa = await EmpresaModel.create({
        idUtilizador: id_utilizador,
        nome: nome_empresa,
        email,
        telefone,
        nif,
        rua,
        nPorta: numero,
        codPostal: codigo_postal,
        location
      });

      // ✅ DEVOLVE NO FORMATO DO GET
      return res.status(201).json({
        exists: true,
        empresa
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: "Error creating company profile"
      });
    }
  },

  // =======================================
  // GET MY COMPANY PROFILE
  // =======================================
  getMe: async (req, res) => {
    try {
      const { id_utilizador, role } = req.user;

      if (role !== "empresa") {
        return res.status(403).json({
          error: "Only company accounts can access this resource"
        });
      }

      const empresa = await EmpresaModel.findByUserId(id_utilizador);

      if (!empresa) {
        return res.json({ exists: false });
      }

      return res.json({
        exists: true,
        empresa
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: "Error retrieving company profile"
      });
    }
  }
};

module.exports = EmpresaController;
