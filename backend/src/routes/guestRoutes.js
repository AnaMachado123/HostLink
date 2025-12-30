const express = require("express");
const router = express.Router();
const GuestController = require("../controllers/guestController");
const authMiddleware = require("../middleware/authMiddleware");

// criar / submeter perfil
router.post("/profile", authMiddleware, GuestController.createProfile);

// ir buscar perfil do guest autenticado
router.get("/me", authMiddleware, GuestController.getMe);

module.exports = router;
