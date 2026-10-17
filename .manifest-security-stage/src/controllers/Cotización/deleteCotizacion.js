const Cotizacion = require("../../models/Cotizacion");

const deleteCotizacion = async (req, res) => {
  const { _id } = req.body;
  try {
    const cotizacion = await Cotizacion.findByIdAndDelete({ _id });

    if (!cotizacion) {
      return res.status(404).json({ message: "Cotizacion no encontrada" });
    }

    return res.status(200).json({ message: "Cotizacion eliminada" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = deleteCotizacion;
