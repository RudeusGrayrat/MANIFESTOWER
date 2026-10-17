const PlantillasDeContrato = require("../../../../models/RecursosHumanos/PlantillasDeContrato");

const postPlantillasDeContrato = async (req, res) => {
  const { state, tipoContrato, archivo } = req.body;
  try {
    if (!state || !tipoContrato || !archivo) {
      return res.status(400).json({ message: "Falta state" });
    }
    if ((state !== "ACTIVO" && state !== "INACTIVO") || !state) {
      return res.status(400).json({ message: "State no válido" });
    }
    if (!tipoContrato) {
      return res.status(400).json({ message: "Falta tipo de contrato" });
    }
    const plantillasDeContratoExistente = await PlantillasDeContrato.findOne({
      tipoContrato,
    });
    if (plantillasDeContratoExistente) {
      return res
        .status(400)
        .json({ message: "Este tipo de contrato ya existe" });
    }
    const plantillasDeContrato = new PlantillasDeContrato({
      state,
      tipoContrato,
      archivo,
    });
    await plantillasDeContrato.save();
    return res.status(201).json({ message: "Plantilla de contrato creada" });
  } catch (error) {
    return res.status(500).json({
      message: "Error al crear una plantilla de contrato ",
      error: error.message,
    });
  }
};

module.exports = postPlantillasDeContrato;
