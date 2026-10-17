const Widget = require("../../../models/Herramientas/Widgets/Widget");
const {
  deleteImage,
  extractPublicId,
} = require("../../../utils/cloudinary/images");

const deleteWidget = async (req, res) => {
  const { _id } = req.body;
  try {
    const widgetDelete = await Widget.findById(_id);
    if (!widgetDelete) {
      return res.status(404).json({ message: "Widget no encontrado" });
    }
    const publicId = extractPublicId(widgetDelete.imagen);
    console.log("publicId", publicId);
    if (!publicId) {
      return res.status(404).json({ message: "No se encontró la imagen" });
    }

    const eliminarImage = await deleteImage(publicId);
    if (!eliminarImage) {
      return res.status(404).json({ message: "No se pudo eliminar la imagen" });
    }
    await Widget.deleteOne({ _id });
    return res.status(200).json({ message: "Widget eliminado correctamente" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = deleteWidget;
