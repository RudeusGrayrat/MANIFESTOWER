const Sede = require("../../../../models/AllModulos/Almacen/Sede");

const deleteSedeAlmacen = async (req, res) => {
  const { _id } = req.body;

  try {
    const findSede = await Sede.findById(_id);
    if (!findSede) {
      return res.status(404).json({ message: "Sede no encontrada" });
    }

    await Sede.deleteOne({ _id });
    return res.status(200).json({ message: "Sede eliminada exitosamente" });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Error al eliminar la Sede",
    });
  }
};

module.exports = deleteSedeAlmacen;
