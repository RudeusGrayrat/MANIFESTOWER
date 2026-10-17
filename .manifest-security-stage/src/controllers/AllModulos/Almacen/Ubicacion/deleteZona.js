const Zona = require("../../../../models/AllModulos/Almacen/Zona");

const deleteZonaAlmacen = async (req, res) => {
  const { _id } = req.body;

  try {
    const zona = await Zona.findById(_id);
    if (!zona) {
      return res.status(404).json({ message: "Zona no encontrada" });
    }

    await Zona.deleteOne({ _id });
    return res.status(200).json({ message: "Zona eliminada exitosamente" });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Error al eliminar la zona",
    });
  }
};

module.exports = deleteZonaAlmacen;
