const express = require("express");
const router = express.Router();
const ServicoController = require("../controllers/servicoController");
const authMiddleware = require("../middleware/authMiddleware");

// público: listar serviços, buscar por id
router.get("/", ServicoController.list);
router.get("/:id", ServicoController.getById);

// admin: criar / apagar
router.post("/", authMiddleware, ServicoController.create);
router.delete("/:id", authMiddleware, ServicoController.delete);

module.exports = router;
