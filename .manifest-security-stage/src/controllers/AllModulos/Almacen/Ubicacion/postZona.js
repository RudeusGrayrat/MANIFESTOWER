const Zona = require("../../../../models/AllModulos/Almacen/Zona");

const postZonaAlmacen = async (req, res) => {
  const { nombre, orientacion, racks, almacenId } = req.body;

  try {
    if (!nombre || !almacenId || !racks) {
      return res.status(400).json({
        message: "Faltan datos requeridos para crear la zona",
      });
    }
    const findZona = await Zona.findOne({ nombre, almacenId });
    if (findZona) {
      return res.status(400).json({
        message: "Ya existe una zona con ese nombre en este almacén",
      });
    }
    const nuevaZona = {
      nombre,
      almacenId,
      orientacion: orientacion || "HORIZONTAL",
      racks: racks.map((rack) => ({
        nombre: rack.nombre,
        niveles: rack.niveles,
        seccionesPorNivel: rack.seccionesPorNivel,
      })),
    };
    const reponse = await Zona.create(nuevaZona);
    return res.status(201).json({
      message: "Zona creada exitosamente",
      zona: reponse,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Error al crear la zona",
    });
  }
};

module.exports = postZonaAlmacen;
