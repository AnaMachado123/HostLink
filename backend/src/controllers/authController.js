const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AuthModel = require("../models/authModel");

// =======================
// ROLE MAPPING
// =======================
const ROLE_MAP = {
  proprietario: 2,
  empresa: 3,
  guest: 4
};

// =======================
// REGISTER
// =======================
async function register(req, res) {
  const { nome, username, password, role } = req.body;

  const idTipoUser = ROLE_MAP[role];
  if (!idTipoUser) {
    return res.status(400).json({ error: "Invalid role" });
  }

  try {
    const existingUser = await AuthModel.findUserByUsername(username);
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await AuthModel.createUser(
      nome,
      username,
      passwordHash,
      idTipoUser
    );

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser.id_utilizador,
        username: newUser.username,
        id_tipouser: newUser.id_tipouser
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error during registration" });
  }
}

// =======================
// LOGIN
// =======================
async function login(req, res) {
  const { username, password } = req.body;

  try {
    const user = await AuthModel.findUserByUsername(username);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user.id_utilizador,
        id_tipouser: user.id_tipouser
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.json({
      message: "Login successful",
      token
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error during login" });
  }
}

// =======================
// EXPORTS (CRITICAL)
// =======================
module.exports = {
  register,
  login
};
