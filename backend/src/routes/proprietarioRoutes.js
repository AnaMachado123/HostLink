const express = require("express");
const router = express.Router();

const ProprietarioController = require("../controllers/proprietarioController");
const authMiddleware = require("../middleware/authMiddleware");

// CREATE PROFILE
router.post(
  "/profile",
  authMiddleware,
  ProprietarioController.createProfile
);

// GET MY PROFILE  ✅ AQUI ESTÁ O FIX
router.get(
  "/me",
  authMiddleware,
  ProprietarioController.getMe
);

module.exports = router;
