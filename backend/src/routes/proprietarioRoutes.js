const express = require("express");
const router = express.Router();
const ProprietarioController = require("../controllers/proprietarioController");
const authMiddleware = require("../middleware/authMiddleware");

// Criar perfil de proprietário (utilizador autenticado com tipoUser = 2)
router.post("/", authMiddleware, ProprietarioController.createProfile);

// Obter o meu próprio perfil de proprietário
router.get("/me", authMiddleware, ProprietarioController.getMyProfile);

// (Opcional) listar todos os proprietários – admin only
router.get("/", authMiddleware, ProprietarioController.getAll);

module.exports = router;
