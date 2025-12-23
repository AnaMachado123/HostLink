const express = require("express");
const router = express.Router();
const servicoExecutadoController = require("../controllers/servicoExecutadoController");
const auth = require("../middleware/authMiddleware");

router.post("/", auth, servicoExecutadoController.criarServicoExecutado);
router.get("/", auth, servicoExecutadoController.listarServicosExecutados);

module.exports = router;
