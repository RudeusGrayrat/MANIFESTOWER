const Almacen = require("../../../../models/AllModulos/Almacen/Almacen");
const Sede = require("../../../../models/AllModulos/Almacen/Sede");

const postAlmacen = async (req, res) => {
  try {
    const { nombre, sedeId, descripcion } = req.body;

    if (!nombre || !sedeId) {
      return res.status(400).json({ message: "Faltan  campos requeridos" });
    }
    const findsede = await Sede.findById(sedeId);
    if (!findsede) {
      return res.status(404).json({ message: "Sede no encontrado" });
    }
    const findAlmacen = await Almacen.findOne({ nombre, sedeId });
    if (findAlmacen) {
      return res.status(400).json({
        message: "Ya existe un almacen con ese nombre",
      });
    }
    await Almacen.create({
      nombre,
      sedeId,
      descripcion,
    });

    return res.status(201).json({ message: "Almacen creado exitosamente" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
};

module.exports = postAlmacen;
