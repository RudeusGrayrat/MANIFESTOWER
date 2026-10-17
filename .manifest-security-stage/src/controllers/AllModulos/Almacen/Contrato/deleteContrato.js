const ContratoAlmacen = require("../../../../models/AllModulos/Almacen/Contrato");

const deleteContratoAlmacen = async (req, res) => {
  const { _id } = req.body;
  try {
    const contratoFound = await ContratoAlmacen.findByIdAndDelete(_id);
    if (!contratoFound) {
      return res.status(400).json({ message: "Contrato no existe" });
    }
    return res.status(200).json({
      message: "Contrato eliminado exitosamente",
    });
  } catch (error) {
    console.log("error", error);

    return res.status(500).json({ message: error.message });
  }
};

module.exports = deleteContratoAlmacen;
