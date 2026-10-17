const Almacen = require("../../../../models/AllModulos/Almacen/Almacen");

const getAllNavesAlmacen = async (req, res) => {
  try {
    const naves = await Almacen.find().populate("sedeId", "nombre");

    return res.status(200).json(naves);
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Error interno del servidor" });
  }
};

module.exports = getAllNavesAlmacen;
