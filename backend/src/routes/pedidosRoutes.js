const express = require("express");
const router = express.Router();
const pedidoController = require("../controllers/pedidoController");
const auth = require("../middleware/authMiddleware");

/* =====================================================
   PROPRIETÁRIO
===================================================== */

// Criar pedido
router.post("/", auth, pedidoController.criarPedido);

// Listar os próprios pedidos
router.get("/me", auth, pedidoController.listarPedidosProprietario);

/* =====================================================
   EMPRESA
===================================================== */

// Listar pedidos pendentes da empresa
router.get(
  "/empresa",
  auth,
  pedidoController.listarPedidosEmpresa
);

/* =====================================================
   EMPRESA / ADMIN
===================================================== */

// Atualizar estado do pedido (aprovar, cancelar, etc.)
router.patch(
  "/:id/estado",
  auth,
  pedidoController.atualizarEstadoPedido
);

module.exports = router;
