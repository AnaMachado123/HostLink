const express = require("express");
const router = express.Router();
const pedidoController = require("../controllers/pedidoController");
const auth = require("../middleware/authMiddleware");

router.post("/", auth, pedidoController.criarPedido);
router.get("/me", auth, pedidoController.listarPedidosProprietario);

module.exports = router;
