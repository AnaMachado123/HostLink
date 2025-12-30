const GuestModel = require("../models/guestModel");

const GuestController = {

  // ===============================
  // GET MY GUEST PROFILE
  // ===============================
  getMe: async (req, res) => {
    try {
      const { email, role } = req.user;

      if (role !== "guest") {
        return res.status(403).json({ error: "Not a guest account" });
      }

      const guest = await GuestModel.findByEmail(email);

      if (!guest) {
        return res.json({ exists: false });
      }

      return res.json({ exists: true, guest });

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error fetching guest profile" });
    }
  },

  // ===============================
  // CREATE GUEST PROFILE
  // ===============================
  createProfile: async (req, res) => {
    try {
      const { role } = req.user;

      if (role !== "guest") {
        return res.status(403).json({ error: "Not a guest account" });
      }

      const { nome, email, telefone, nif } = req.body;

      const guest = await GuestModel.create({
        nome,
        email,
        telefone,
        nif
      });

      res.status(201).json({ message: "Guest profile created", guest });

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error creating guest profile" });
    }
  }
};

module.exports = GuestController;
