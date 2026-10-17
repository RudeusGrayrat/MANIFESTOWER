const InventarioSistemas = require("../../../../models/AllModulos/SISTEMAS/Inventario/Inventario");

const patchInventarioSistemas = async (req, res) => {
  const {
    _id,
    categoria,
    marca,
    modelo,
    especificaciones,
    area,
    sede,
    estado,
    observaciones,
  } = req.body;
  try {
    const inventario = await InventarioSistemas.findById(_id);
    if (!inventario) {
      return res.status(404).json({ message: "Inventario no encontrado" });
    }
    const existingInventario = await InventarioSistemas.findOne({
      categoria,
      marca,
      modelo,
      especificaciones,
    });

    if (existingInventario) {
      return res.status(400).json({
        message:
          "Ya existe un inventario con este categoria, marca, modelo y especificaciones",
      });
    }

    if (categoria) inventario.categoria = categoria;
    if (marca) inventario.marca = marca;
    if (modelo) inventario.modelo = modelo;
    if (especificaciones) inventario.especificaciones = especificaciones;
    if (area) inventario.area = area;
    if (sede) inventario.sede = sede;
    if (estado) inventario.estado = estado;
    if (observaciones) inventario.observaciones = observaciones;

    await inventario.save();

    return res.status(200).json({
      message: "Inventario editado correctamente",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = patchInventarioSistemas;
