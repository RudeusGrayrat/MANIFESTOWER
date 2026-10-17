const BoletaDePagos = require("../../../../models/RecursosHumanos/BoletaDePago");
const actualizarCorrelativas = require("./actualizarCorrelativa");

const deleteBoletaDePago = async (req, res) => {
  const { _id } = req.body;
  try {
    // Eliminar la boleta de pago
    const boletaFound = await BoletaDePagos.findByIdAndDelete(_id);
    if (!boletaFound) {
      return res.status(400).json({ message: "Boleta de pagos no existe" });
    }

    // Actualizar correlativas mayores
    if (boletaFound.correlativa) {
      await actualizarCorrelativas(boletaFound.correlativa);
    }

    return res
      .status(200)
      .json({
        message: "Boleta de pagos eliminada exitosamente",
        correlativa: boletaFound.correlativa,
      });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = deleteBoletaDePago;
