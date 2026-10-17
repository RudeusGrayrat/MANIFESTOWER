const Almacen = require("../../../../models/AllModulos/Almacen/Almacen");

const deleteNaveAlmacen = async (req, res) => {
  const { _id } = req.body;

  try {
    const Nave = await Almacen.findById(_id);
    if (!Nave) {
      return res.status(404).json({ message: "Almacen no encontrada" });
    }

    await Almacen.deleteOne({ _id });
    return res.status(200).json({ message: "Almacen eliminada exitosamente" });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Error al eliminar la Almacen",
    });
  }
};

module.exports = deleteNaveAlmacen;
