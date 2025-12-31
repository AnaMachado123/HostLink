const express = require("express");
const router = express.Router();
const GuestController = require("../controllers/guestController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/me", authMiddleware, GuestController.getMe);
router.post("/profile", authMiddleware, GuestController.createProfile);

module.exports = router;
