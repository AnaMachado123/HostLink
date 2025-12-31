const GuestModel = require("../models/guestModel");
const AuthModel = require("../models/authModel");

const GuestController = {

  // ===============================
  // GET MY GUEST PROFILE
  // ===============================
  getMe: async (req, res) => {
    try {
      const { role } = req.user;

      if (role !== "guest") {
        return res.status(403).json({ error: "Not a guest account" });
      }

      // 🔥 source of truth
      const user = await AuthModel.findUserById(req.user.id_utilizador);

      const guest = await GuestModel.findByEmail(user.username);

      if (!guest) {
        return res.json({ exists: false });
      }

      return res.json({ exists: true, guest });

    } catch (err) {
      console.error("Guest getMe error:", err);
      return res.status(500).json({ error: "Error fetching guest profile" });
    }
  },

  // ===============================
  // CREATE GUEST PROFILE
  // ===============================
  createProfile: async (req, res) => {
    try {
      const { role, id_utilizador } = req.user;

      if (role !== "guest") {
        return res.status(403).json({ error: "Not a guest account" });
      }

      // 🔥 buscar SEMPRE o user real
      const user = await AuthModel.findUserById(id_utilizador);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const { telefone, nif } = req.body;

      if (!telefone) {
        return res.status(400).json({ error: "Phone is required" });
      }

      const guest = await GuestModel.create({
        nome: user.nome,           // ✅ NUNCA NULL
        email: user.username,      // ✅ email real
        telefone,
        nif
      });

      return res.status(201).json({
        exists: true,
        guest
      });

    } catch (err) {
      console.error("Guest createProfile error:", err);
      return res.status(500).json({ error: "Error creating guest profile" });
    }
  }
};

module.exports = GuestController;
