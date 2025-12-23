module.exports = (req, res, next) => {
  if (req.user.id_tipouser !== 1) {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
};