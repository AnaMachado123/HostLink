const pool = require("../config/db");
const ImovelModel = require("../models/imovelModel");
const ProprietarioModel = require("../models/proprietarioModel");

const ImovelController = {
  /* ================= CREATE ================= */
  create: async (req, res) => {
    try {
      const { role, id_utilizador } = req.user;

      if (role !== "proprietario") {
        return res
          .status(403)
          .json({ error: "Only proprietarios can create imoveis" });
      }

      const proprietario = await ProprietarioModel.findByUserId(id_utilizador);

      if (!proprietario) {
        return res
          .status(400)
          .json({ error: "Proprietario profile not found" });
      }

      const {
        nome,
        capacidade,
        rua,
        nporta,
        descricao,
        cod_postal,
        localidade
      } = req.body;

      if (
        !nome ||
        !rua ||
        !nporta ||
        !cod_postal ||
        !capacidade ||
        !localidade
      ) {
        return res
          .status(400)
          .json({ error: "Missing required fields" });
      }

      /* ===== COD POSTAL (cria se não existir) ===== */
      const codPostalExists = await pool.query(
        "SELECT 1 FROM codpostal WHERE cod_postal = $1",
        [cod_postal]
      );

      if (codPostalExists.rowCount === 0) {
        await pool.query(
          "INSERT INTO codpostal (cod_postal, localidade) VALUES ($1, $2)",
          [cod_postal, localidade]
        );
      }

      /* ===== IMAGE ===== */
      const imagem = req.file ? req.file.filename : null;

      /* ===== CREATE IMOVEL ===== */
      const imovel = await ImovelModel.create({
        id_proprietario: proprietario.id_proprietario,
        nome,
        capacidade,
        rua,
        nporta,
        descricao,
        cod_postal,
        imagem
      });

      return res.status(201).json(imovel);

    } catch (error) {
      console.error("CREATE IMOVEL ERROR:", error);
      return res.status(500).json({ error: "Error creating imovel" });
    }
  },

  /* ================= GET MY IMOVEIS ================= */
  getMyImoveis: async (req, res) => {
    try {
      const { role, id_utilizador } = req.user;

      if (role !== "proprietario") {
        return res
          .status(403)
          .json({ error: "Only proprietarios can access their imoveis" });
      }

      const proprietario = await ProprietarioModel.findByUserId(id_utilizador);

      if (!proprietario) {
        return res
          .status(400)
          .json({ error: "Proprietario profile not found" });
      }

      const imoveis = await ImovelModel.getByOwner(
        proprietario.id_proprietario
      );

      return res.json(imoveis);

    } catch (error) {
      console.error("GET MY IMOVEIS ERROR:", error);
      return res.status(500).json({ error: "Error fetching imoveis" });
    }
  },

  /* ================= GET BY ID ================= */
  getById: async (req, res) => {
    try {
      const { id } = req.params;

      const imovel = await ImovelModel.getById(id);

      if (!imovel) {
        return res.status(404).json({ error: "Imovel not found" });
      }

      return res.json(imovel);

    } catch (error) {
      console.error("GET IMOVEL ERROR:", error);
      return res.status(500).json({ error: "Error fetching imovel" });
    }
  },

  /* ================= UPDATE ================= */
  /* ================= UPDATE ================= */
update: async (req, res) => {
  try {
    const { role, id_utilizador } = req.user;
    const { id } = req.params;

    if (role !== "proprietario") {
      return res
        .status(403)
        .json({ error: "Only proprietarios can update imoveis" });
    }

    const proprietario = await ProprietarioModel.findByUserId(id_utilizador);
    const imovel = await ImovelModel.getById(id);

    if (!imovel) {
      return res.status(404).json({ error: "Imovel not found" });
    }

    if (imovel.id_proprietario !== proprietario.id_proprietario) {
      return res
        .status(403)
        .json({ error: "You do not own this imovel" });
    }

    const updateData = { ...req.body };

    /* ====== COD POSTAL (SE ALTERADO) ====== */
    if (updateData.cod_postal) {
      const exists = await pool.query(
        "SELECT 1 FROM codpostal WHERE cod_postal = $1",
        [updateData.cod_postal]
      );

      if (exists.rowCount === 0) {
        if (!updateData.localidade) {
          return res.status(400).json({
            error: "Localidade is required for a new postal code"
          });
        }

        await pool.query(
          "INSERT INTO codpostal (cod_postal, localidade) VALUES ($1,$2)",
          [updateData.cod_postal, updateData.localidade]
        );
      }
    }

    /* ====== IMAGE ====== */
    if (req.file) {
      updateData.imagem = req.file.filename;
    } else {
      delete updateData.imagem;
    }

    // Nunca atualizar localidade diretamente na tabela imovel
    delete updateData.localidade;

    const updated = await ImovelModel.update(id, updateData);

    return res.json(updated);

  } catch (error) {
    console.error("UPDATE IMOVEL ERROR:", error);
    return res.status(500).json({ error: "Error updating imovel" });
  }
},
  /* ================= DELETE ================= */
  delete: async (req, res) => {
    try {
      const { role, id_utilizador } = req.user;
      const { id } = req.params;

      if (role !== "proprietario") {
        return res
          .status(403)
          .json({ error: "Only proprietarios can delete imoveis" });
      }

      const proprietario = await ProprietarioModel.findByUserId(id_utilizador);
      const imovel = await ImovelModel.getById(id);

      if (!imovel) {
        return res.status(404).json({ error: "Imovel not found" });
      }

      if (imovel.id_proprietario !== proprietario.id_proprietario) {
        return res
          .status(403)
          .json({ error: "You do not own this imovel" });
      }

      const deleted = await ImovelModel.delete(id);

      return res.json({
        message: "Imovel deleted successfully",
        deleted
      });

    } catch (error) {
      console.error("DELETE IMOVEL ERROR:", error);
      return res.status(500).json({ error: "Error deleting imovel" });
    }
  }
};

module.exports = ImovelController;
