const express = require("express");
const router = express.Router();
const pedidoController = require("../controllers/pedidoController");
const auth = require("../middleware/authMiddleware");

router.post("/", auth, pedidoController.criarPedido);
router.get("/me", auth, pedidoController.listarPedidosProprietario);
router.get("/", auth, pedidoController.listarTodosPedidos);
router.get("/:id", auth, pedidoController.obterPedidoPorId);
router.patch("/:id/status", auth, pedidoController.atualizarStatusPedido);



module.exports = router;
