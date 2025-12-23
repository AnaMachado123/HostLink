const express = require("express");
const router = express.Router();
const pedidoController = require("../controllers/pedidoController");
const auth = require("../middleware/authMiddleware");

// Criar pedido (Proprietário)
router.post("/", auth, pedidoController.criarPedido);

// Listar os seus pedidos (proprietário)
router.get("/me", auth, pedidoController.listarPedidosProprietario);

// Listar todos os pedidos (Admin)
router.get("/", auth, pedidoController.listarTodosPedidos);

// Obter pedido por ID (Admin ou Proprietário)
router.get("/:id", auth, pedidoController.obterPedidoPorId);

// Atualizar estado do pedido (Admin)
router.patch("/:id/estado", auth, pedidoController.atualizarEstadoPedido);

module.exports = router;
