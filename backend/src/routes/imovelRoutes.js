const express = require("express");
const router = express.Router();
const ImovelController = require("../controllers/imovelController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, ImovelController.create);
router.get("/me", authMiddleware, ImovelController.getMyImoveis);
router.get("/", authMiddleware, ImovelController.getAll);
router.get("/:id", ImovelController.getById);
router.put("/:id", authMiddleware, ImovelController.update);
router.delete("/:id", authMiddleware, ImovelController.delete);

module.exports = router;
