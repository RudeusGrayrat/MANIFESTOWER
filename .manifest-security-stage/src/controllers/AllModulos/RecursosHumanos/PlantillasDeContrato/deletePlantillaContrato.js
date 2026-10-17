const PlantillasDeContrato = require("../../../../models/RecursosHumanos/PlantillasDeContrato");

const deletePlantillaContrato = async (req, res) => {
  const { _id } = req.body;

  try {

    const userDelete = await PlantillasDeContrato.findByIdAndDelete(_id);

    if (!userDelete) {
      return res.status(404).json({ message: "Plantilla de Contrato no encontrado" });
    }

    return res.status(200).json({
      message: "Plantilla de Contrato eliminado correctamente",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = deletePlantillaContrato;
