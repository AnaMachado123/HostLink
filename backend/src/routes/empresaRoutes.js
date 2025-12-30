const express = require("express");
const router = express.Router();
const EmpresaController = require("../controllers/empresaController");
const authMiddleware = require("../middleware/authMiddleware");

// Create or update company profile
router.post("/profile", authMiddleware, EmpresaController.createProfile);

// Get logged-in company profile
router.get("/me", authMiddleware, EmpresaController.getMe);

// (opcional – admin, podemos ativar depois)
// router.get("/", authMiddleware, EmpresaController.getAll);

module.exports = router;
