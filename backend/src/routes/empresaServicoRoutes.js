const express = require("express");
const router = express.Router();
const EmpresaServicoController = require("../controllers/empresaServicoController");
const authMiddleware = require("../middleware/authMiddleware");

// empresa associa um serviço a si mesma
router.post("/me", authMiddleware, EmpresaServicoController.addServico);

// empresa vê os serviços associados
router.get("/me", authMiddleware, EmpresaServicoController.listMyServices);

module.exports = router;
