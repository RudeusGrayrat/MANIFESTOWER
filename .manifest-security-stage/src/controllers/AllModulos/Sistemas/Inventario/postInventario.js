const InventarioSistemas = require("../../../../models/AllModulos/SISTEMAS/Inventario/Inventario");

const postInventarioSistemas = async (req, res) => {
  const {
    codigo,
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
    if (!codigo || !categoria || !marca || !modelo || !especificaciones) {
      return res.status(400).json({ message: "Faltan datos" });
    }
    const existingItem = await InventarioSistemas.findOne({
      codigo,
      categoria,
      marca,
      modelo,
      especificaciones,
    });
    if (existingItem) {
      return res
        .status(400)
        .json({ message: "El inventario ya existe en el sistema" });
    }

    const newInventario = new InventarioSistemas({
      codigo,
      categoria,
      marca,
      modelo,
      especificaciones,
      area,
      sede,
      estado,
      observaciones,
    });

    await newInventario.save();
    res.status(201).json({ message: "Inventario creado", data: newInventario });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = postInventarioSistemas;
