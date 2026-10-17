const ContratoAlmacen = require("../../../../models/AllModulos/Almacen/Contrato");
const Sede = require("../../../../models/AllModulos/Almacen/Sede");

const postContratoAlmacen = async (req, res) => {
  try {
    const { cliente, sedeId, fechaInicio, fechaFin, estado } = req.body;

    if (!cliente || !sedeId || !fechaInicio || !fechaFin) {
      return res.status(400).json({
        message: "Faltan datos requeridos para crear el contrato",
      });
    }
    const findContrato = await ContratoAlmacen.findOne({ cliente, sedeId });
    if (findContrato) {
      return res.status(400).json({
        message: "El contrato ya existe",
      });
    }
    const findSede = await Sede.findById(sedeId);
    if (!findSede) {
      return res.status(404).json({
        message: "Sede no encontrada",
      });
    }
    const newContrato = new ContratoAlmacen({
      cliente,
      sedeId,
      fechaInicio,
      fechaFin,
      estado: estado || "ACTIVO",
    });
    await newContrato.save();
    return res.status(201).json({
      message: "Contrato creado exitosamente",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = postContratoAlmacen;
