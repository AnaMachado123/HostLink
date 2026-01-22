const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AuthModel = require("../models/authModel");

// =======================
// ROLE MAPPING
// =======================
const ROLE_MAP = {
  admin: 1,
  proprietario: 2,
  empresa: 3,
  guest: 4
};

// Reverse mapping (JWT + frontend)
const ROLE_MAP_REVERSE = {
  1: "admin",
  2: "proprietario",
  3: "empresa",
  4: "guest"
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

    let status = "PENDING";
    if (role === "guest") {
      status = "ACTIVE";
    }

    const newUser = await AuthModel.createUser(
      nome,
      username,
      passwordHash,
      idTipoUser,
      status
    );

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id_utilizador: newUser.id_utilizador,
        role
      }
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return res.status(500).json({ error: "Error during registration" });
  }
}

// =======================
// LOGIN  ✅ ESTÁVEL
// =======================
async function login(req, res) {
  const { username, password } = req.body;

  try {
    const user = await AuthModel.findUserByUsername(username);

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const role = ROLE_MAP_REVERSE[user.id_tipouser];

    // ⚠️ CRÍTICO:
    // login NÃO depende de perfil existir
    let idEmpresa = null;

<<<<<<< HEAD
    // se for empresa, vai buscar o id_empresa
=======
>>>>>>> b1d46b8b0213a4c87588173bacafdc6705ef2694
    if (role === "empresa") {
      const empresa = await AuthModel.findEmpresaByUserId(
        user.id_utilizador
      );
      idEmpresa = empresa ? empresa.id_empresa : null;
    }

    const token = jwt.sign(
      {
        id_utilizador: user.id_utilizador,
        role,
        id_empresa: idEmpresa
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.json({
      message: "Login successful",
      token,
      user: {
        id_utilizador: user.id_utilizador,
        role,
        status: user.status,
        nome: user.nome,
        email: user.username,
        id_empresa: idEmpresa
      }
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ error: "Error during login" });
  }
}

// =======================
// GET AUTHENTICATED USER
// =======================
async function me(req, res) {
  try {
    const { id_utilizador, role } = req.user;

    const user = await AuthModel.findUserById(id_utilizador);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({
      id_utilizador: user.id_utilizador,
      role,
      nome: user.nome,
      email: user.username
    });
  } catch (err) {
    console.error("AUTH ME ERROR:", err);
    return res.status(500).json({
      error: "Error fetching authenticated user"
    });
  }
}

// =======================
// EXPORTS
// =======================
module.exports = {
  register,
  login,
  me
};
