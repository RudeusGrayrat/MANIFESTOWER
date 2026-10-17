const Movimiento = require("../../../../models/AllModulos/Almacen/Movimiento");
const actualizarCorrelativas = require("./actualizarCorrelativa");

const deleteMovimientoAlmacen = async (req, res) => {
  const { _id } = req.body;
  try {
    // Eliminar la boleta de pago
    const movimientoFound = await Movimiento.findByIdAndDelete(_id);
    if (!movimientoFound) {
      return res.status(400).json({ message: "Movimiento no existe" });
    }

    // Actualizar correlativas mayores
    if (movimientoFound.correlativa) {
      await actualizarCorrelativas(
        movimientoFound.correlativa,
        movimientoFound.contratoId,
        movimientoFound.movimiento
      );
    }

    return res.status(200).json({
      message: "Movimiento eliminada exitosamente",
      correlativa: movimientoFound.correlativa,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = deleteMovimientoAlmacen;
