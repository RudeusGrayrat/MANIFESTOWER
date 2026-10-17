const Sede = require("../../../../models/AllModulos/Almacen/Sede");

const getAllSedesAlmacen = async (req, res) => {
  try {
    const sedes = await Sede.find();

    return res.status(200).json(sedes);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = getAllSedesAlmacen;
