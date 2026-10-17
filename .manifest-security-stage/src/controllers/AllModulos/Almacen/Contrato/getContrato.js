const ContratoAlmacen = require("../../../../models/AllModulos/Almacen/Contrato");

const getAllContratos = async (req, res) => {
  try {
    const contratos = await ContratoAlmacen.find().populate("sedeId", "nombre");
    return res.status(200).json(contratos);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = getAllContratos;
