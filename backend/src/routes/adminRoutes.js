const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/isAdmin");
const adminController = require("../controllers/adminController");

router.get(
  "/users",
  authMiddleware,
  isAdmin,
  adminController.getPendingUsers
);

router.get(
  "/users/:id",
  authMiddleware,
  isAdmin,
  adminController.getUserDetails
);

router.post(
  "/users/:id/approve",
  authMiddleware,
  isAdmin,
  adminController.approveUser
);

router.post(
  "/users/:id/reject",
  authMiddleware,
  isAdmin,
  adminController.rejectUser
);


module.exports = router;
