const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const faturaController = require("../controllers/faturaController");

// Emitir fatura a partir de um pedido
router.post(
  "/from-pedido/:idPedido",
  auth,
  faturaController.emitirFaturaPorPedido
);

// 🔹 Proprietário
router.get(
  "/proprietario",
  auth,
  faturaController.listarFaturasProprietario
);

// 🔹 Empresa
router.get(
  "/empresa",
  auth,
  faturaController.listarFaturasEmpresa
);

module.exports = router;
