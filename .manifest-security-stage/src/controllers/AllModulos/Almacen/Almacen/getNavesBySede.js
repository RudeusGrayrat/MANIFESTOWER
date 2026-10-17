const Almacen = require("../../../../models/AllModulos/Almacen/Almacen");

const getNavesBySede = async (req, res) => {
  const { sedeId } = req.query;

  try {
    const response = await Almacen.find(sedeId);

    return res.json(response);
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Error al obtener las boletas de pago",
    });
  }
};

module.exports = getNavesBySede;
