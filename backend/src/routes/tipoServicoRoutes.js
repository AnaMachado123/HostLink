const express = require("express");
const router = express.Router();
const TipoServicoController = require("../controllers/tipoServicoController");
const authMiddleware = require("../middleware/authMiddleware");

// público: listar tipos
router.get("/", TipoServicoController.list);

// admin: criar / apagar
router.post("/", authMiddleware, TipoServicoController.create);
router.delete("/:id", authMiddleware, TipoServicoController.delete);

module.exports = router;
