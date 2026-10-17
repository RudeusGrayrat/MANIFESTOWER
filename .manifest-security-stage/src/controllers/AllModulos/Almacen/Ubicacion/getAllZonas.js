const Zona = require("../../../../models/AllModulos/Almacen/Zona");

const getAllZonas = async (req, res) => {
  try {
    const zonas = await Zona.find().populate("almacenId", "nombre");

    return res.status(200).json(zonas);
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Error interno del servidor" });
  }
};

module.exports = getAllZonas;
