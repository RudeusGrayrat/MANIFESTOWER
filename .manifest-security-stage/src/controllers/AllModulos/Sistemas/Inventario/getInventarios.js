const InventarioSistemas = require("../../../../models/AllModulos/SISTEMAS/Inventario/Inventario");

const getIntenarioSistemas = async (req, res) => {
  try {
    const inventarios = await InventarioSistemas.find().populate("encargado");
    if (!inventarios) {
      return res.status(404).json({ message: "No se encontraron inventarios" });
    }
    res.status(200).json(inventarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener los inventarios" });
  }
};

module.exports = getIntenarioSistemas;
