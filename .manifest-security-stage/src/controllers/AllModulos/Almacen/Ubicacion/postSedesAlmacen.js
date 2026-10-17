const Sede = require("../../../../models/AllModulos/Almacen/Sede");

const postSedesAlmacen = async (req, res) => {
  try {
    const { nombre, direccion, ciudad, departamento, pais, estado } = req.body;

    if (!nombre) {
      return res.status(400).json({
        message: "Faltan datos requeridos para crear la sede",
      });
    }

    const newSede = new Sede({
      nombre,
      direccion: direccion || "",
      ciudad: ciudad || "",
      departamento: departamento || "",
      pais: pais || "",
      estado: estado || "ACTIVO",
    });

    await newSede.save();

    return res.status(201).json({
      message: "Sede creada exitosamente",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = postSedesAlmacen;
