const crypto = require("crypto");
const adminModel = require("../models/adminModel");
const sendActivationEmail = require("../utils/emailService");


exports.getPendingUsers = async (req, res) => {
  try {
    const users = await adminModel.getUsersByStatus("PENDING");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users" });
  }
};

exports.approveUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await adminModel.getUserById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.status !== "PENDING") {
      return res.status(400).json({
        message: "Only PENDING users can be approved",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await adminModel.approveUser(id, token, expiresAt);
    await sendActivationEmail(user.username, token);

    res.json({ message: "User approved successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error approving user" });
  }
};

exports.rejectUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await adminModel.getUserById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.status !== "PENDING") {
      return res.status(400).json({
        message: "Only PENDING users can be rejected",
      });
    }

    await adminModel.rejectUser(id);

    res.json({ message: "User rejected successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error rejecting user" });
  }
};
