const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/isAdmin");
const adminController = require("../controllers/adminController");

router.get(
  "/users",
  authMiddleware,
  isAdmin,
  adminController.getAllUsers     /*getPendingUsers*/
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

router.get(
  "/users/:id/history",
  authMiddleware,
  isAdmin,
  adminController.getUserHistory
);

router.get(
  "/dashboard",
  authMiddleware,
  isAdmin,
  adminController.getAdminDashboard
);

router.get(
  "/invoices",
  authMiddleware,
  isAdmin,
  adminController.getAllInvoices
);


module.exports = router;
