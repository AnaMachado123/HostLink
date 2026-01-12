const express = require("express");
const router = express.Router();
const ServicoController = require("../controllers/servicoController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, ServicoController.list);
router.get("/:id", authMiddleware, ServicoController.getById);
router.post("/", authMiddleware, ServicoController.create);
router.patch("/:id", authMiddleware, ServicoController.update);
router.delete("/:id", authMiddleware, ServicoController.delete);

module.exports = router;
