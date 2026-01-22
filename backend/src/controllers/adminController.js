const crypto = require("crypto");
const adminModel = require("../models/adminModel");
const sendActivationEmail = require("../utils/emailService");
const EmpresaModel = require("../models/empresaModel");
const ProprietarioModel = require("../models/proprietarioModel");

exports.getPendingUsers = async (req, res) => {
  try {
    const users = await adminModel.getPendingUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users" });
  }
};

// ===============================
// GET USER + PROFILE DETAILS
// ===============================
exports.getUserDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await adminModel.getUserById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let profile = null;

    if (user.role === "empresa") {
      profile = await EmpresaModel.findByUserId(id);
    }

    if (user.role === "proprietario") {
      profile = await ProprietarioModel.findByUserId(id);
    }

    res.json({ user, profile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error loading user details" });
  }
};

// ===============================
// APPROVE USER
// ===============================
exports.approveUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await adminModel.getUserById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.status.toUpperCase() !== "PENDING") {
      return res.status(400).json({
        message: "Only PENDING users can be approved",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await adminModel.approveUser(id, token, expiresAt);

    try {
      await sendActivationEmail(user.email, token);
    } catch (emailErr) {
      console.warn(
        `Falha ao enviar email de ativação para ${user.email}:`,
        emailErr.message
      );
    }

    res.json({ message: "User approved successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error approving user" });
  }
};

// ===============================
// REJECT USER
// ===============================
exports.rejectUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await adminModel.getUserById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.status.toUpperCase() !== "PENDING") {
      return res.status(400).json({
        message: "Only PENDING users can be rejected",
      });
    }

    await adminModel.rejectUser(id);

    return res.json({ message: "User rejected successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Error rejecting user" });
  }
};


exports.getAllUsers = async (req, res) => {
  try {
    const users = await adminModel.getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users" });
  }
};


exports.getUserHistory = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await adminModel.getUserById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let history = null;

    if (user.role === "proprietario") {
      history = await adminModel.getOwnerHistory(id);
    }

    if (user.role === "empresa") {
      history = await adminModel.getCompanyHistory(id);
    }

    res.json(history);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error loading user history" });
  }
};

exports.getAdminDashboard = async (req, res) => {
  try {
    const stats = await adminModel.getAdminStats();
    res.json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error loading admin dashboard" });
  }
};

exports.getAllInvoices = async (req, res) => {
  try {
    const invoices = await adminModel.getAllInvoices();
    res.json(invoices);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error loading invoices" });
  }
};
