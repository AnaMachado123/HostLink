const express = require("express");
const router = express.Router();
const pedidoController = require("../controllers/pedidoController");
const auth = require("../middleware/authMiddleware");

// Criar pedido (proprietário)
router.post("/", auth, pedidoController.criarPedido);

// Listar pedidos do proprietário autenticado
router.get("/me", auth, pedidoController.listarPedidosProprietario);
router.get("/", auth, pedidoController.listarTodosPedidos);
router.get("/:id", auth, pedidoController.obterPedidoPorId);
router.patch("/:id/status", auth, pedidoController.atualizarStatusPedido);



// ADMIN → listar todos os pedidos
router.get("/", auth, pedidoController.listarTodosPedidos);

// ADMIN ou PROPRIETÁRIO → ver pedido por ID
router.get("/:id", auth, pedidoController.listarPedidoPorId);

// ADMIN → atualizar estado do pedido
router.patch("/:id/estado", auth, pedidoController.atualizarEstadoPedido);

module.exports = router;
