const Ubicacion = require("../../../../models/AllModulos/Almacen/Ubicacion");

const postUbicacion = async (req, res) => {
  const { zonaId, porcentaje, observaciones, estado, creadoPor, racks } =
    req.body;

  try {
    if (!zonaId || !creadoPor || !Array.isArray(racks)) {
      return res.status(400).json({
        message: "Faltan datos requeridos para crear las ubicaciones",
      });
    }

    const ubicaciones = [];

    for (const rack of racks) {
      const { nombre, niveles, seccionesPorNivel } = rack;

      for (let nivel = 1; nivel <= parseInt(niveles); nivel++) {
        for (
          let seccion = 1;
          seccion <= parseInt(seccionesPorNivel);
          seccion++
        ) {
          ubicaciones.push({
            zonaId,
            rack: nombre,
            nivel,
            seccion,
            porcentaje: porcentaje || 0,
            observaciones: observaciones || "",
            estado: estado || "LIBRE",
            creadoPor,
          });
        }
      }
    }

    await Ubicacion.insertMany(ubicaciones);

    return res.status(201).json({
      message: "Ubicaciones creadas exitosamente",
      count: ubicaciones.length,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message || "Error al crear las ubicaciones",
    });
  }
};

module.exports = postUbicacion;
