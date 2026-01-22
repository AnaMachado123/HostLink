const express = require("express");
const router = express.Router();

const ImovelController = require("../controllers/imovelController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

// ===============================
// CREATE IMÓVEL (com imagem)
// ===============================
router.post(
  "/",
  authMiddleware,
  upload.single("imagem"),
  ImovelController.create
);

// ===============================
// GET MEUS IMÓVEIS
// ===============================
router.get(
  "/me",
  authMiddleware,
  ImovelController.getMyImoveis
);

// ===============================
// GET IMÓVEL POR ID
// ===============================
router.get(
  "/:id",
  authMiddleware,
  ImovelController.getById
);

// ===============================
// UPDATE IMÓVEL (com ou sem imagem)
// ===============================
router.put(
  "/:id",
  authMiddleware,
  upload.single("imagem"),
  ImovelController.update
);

// ===============================
// DELETE IMÓVEL
// ===============================
router.delete(
  "/:id",
  authMiddleware,
  ImovelController.delete
);

module.exports = router;
