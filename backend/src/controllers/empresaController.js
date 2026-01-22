const jwt = require("jsonwebtoken");
const EmpresaModel = require("../models/empresaModel");

function signEmpresaToken({ id_utilizador, role, id_empresa }) {
  return jwt.sign(
    { id_utilizador, role, id_empresa },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
}

const EmpresaController = {
  // =======================================
  // CREATE COMPANY PROFILE
  // =======================================
  createProfile: async (req, res) => {
    try {
      // ✅ defesa: se auth falhou ou token não tem id
      if (!req.user || !req.user.id_utilizador) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const { id_utilizador, role } = req.user;

      if (role !== "empresa") {
        return res.status(403).json({
          error: "Only company accounts can create a company profile"
        });
      }

      // ✅ se já existir, NÃO cria outra e ainda devolve token correto
      const existing = await EmpresaModel.findByUserId(id_utilizador);
      if (existing) {
        const token = signEmpresaToken({
          id_utilizador,
          role,
          id_empresa: existing.id_empresa
        });

        return res.status(200).json({
          exists: true,
          empresa: existing,
          token
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
      await EmpresaModel.ensureCodigoPostalExists(codigo_postal, location);

      // cria empresa
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

      // 🔑 token atualizado com id_empresa
      const token = signEmpresaToken({
        id_utilizador,
        role,
        id_empresa: empresa.id_empresa
      });

      return res.status(201).json({
        exists: true,
        empresa,
        token
      });
    } catch (error) {
      console.error("CREATE COMPANY ERROR:", error);

      // ✅ se for erro do Postgres (muito comum)
      if (error && error.code) {
        // 23505 = unique_violation
        if (error.code === "23505") {
          return res.status(409).json({
            error: "Duplicate value (unique constraint)",
            detail: error.detail
          });
        }

        return res.status(500).json({
          error: "Database error",
          code: error.code,
          detail: error.detail
        });
      }

      // ✅ devolve msg para debug (em dev)
      return res.status(500).json({
        error: "Error creating company profile",
        message: error?.message
      });
    }
  },

  // =======================================
  // GET MY COMPANY PROFILE
  // =======================================
  getMe: async (req, res) => {
    try {
      if (!req.user || !req.user.id_utilizador) {
        return res.status(401).json({ error: "Unauthorized" });
      }

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
      console.error("GET COMPANY ERROR:", error);
      return res.status(500).json({
        error: "Error retrieving company profile",
        message: error?.message
      });
    }
  }
};

module.exports = EmpresaController;
