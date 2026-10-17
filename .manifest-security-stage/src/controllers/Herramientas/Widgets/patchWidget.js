const Widget = require("../../../models/Herramientas/Widgets/Widget");
const {
  deleteImage,
  extractPublicId,
} = require("../../../utils/cloudinary/images");

const patchWidget = async (req, res) => {
  const { _id, name, imagen, key, grupo, descripcion } = req.body;

  try {
    const widgetUpdate = await Widget.findById(_id);
    if (!widgetUpdate) {
      return res.status(404).json({ message: "Widget no encontrado" });
    }
    if (name) widgetUpdate.name = name;
    if (key) widgetUpdate.key = key;
    if (grupo) widgetUpdate.grupo = grupo;
    if (descripcion) widgetUpdate.descripcion = descripcion;
    if (imagen) {
      const publicId = extractPublicId(widgetUpdate.imagen);
      const borrar = await deleteImage(publicId);
      console.log("borrar", borrar);
      
      widgetUpdate.imagen = imagen;
    }
    await widgetUpdate.save();
    return res.status(200).json({
      message: "Widget actualizado correctamente",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = patchWidget;
