const PlantillasDeContrato = require("../../../../models/RecursosHumanos/PlantillasDeContrato");

const getAllPlantillasDeContrato = async (req, res) => {
  try {
    const plantillasDeContrato = await PlantillasDeContrato.find();
    if (!plantillasDeContrato) {
      return res.status(404).json({
        message: "Plantillas de contrato no encontradas",
      });
    }
    res.status(200).json(plantillasDeContrato);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = getAllPlantillasDeContrato;
