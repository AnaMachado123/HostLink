const express = require("express");
const router = express.Router();
const EmpresaController = require("../controllers/empresaController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, EmpresaController.createProfile);

router.get("/me", authMiddleware, EmpresaController.getMyProfile);

router.get("/", authMiddleware, EmpresaController.getAll);

module.exports = router;
