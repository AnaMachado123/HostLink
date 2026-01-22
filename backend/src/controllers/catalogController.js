const CatalogModel = require("../models/catalogModel");

exports.getCatalog = async (req, res) => {
  try {
    const catalog = await CatalogModel.getFullCatalog();
    res.json(catalog);
  } catch (err) {
    res.status(500).json({ error: "Error loading catalog" });
  }
};
