const PlantillasDeContrato = require("../../../../models/RecursosHumanos/PlantillasDeContrato");

const putPlantillaDeContrato = async (req, res) => {
  const { _id, tipoContrato, archivo, state } = req.body;

  try {
    const updatedContract = await PlantillasDeContrato.findById(_id);
    if (!updatedContract) {
      return res.status(404).json({ message: "Contrato no encontrado" });
    }
    if (!state && !tipoContrato && !archivo) {
      return res.status(400).json({ message: "No hay Cambios" });
    }
    if (tipoContrato) updatedContract.tipoContrato = tipoContrato;
    if (state) updatedContract.state = state;
    if (archivo) updatedContract.archivo = archivo;

    await updatedContract.save();

    return res
      .status(200)
      .json({ message: "Contrato actualizado correctamente" });
  } catch (error) {
    return res.status(500).json({ message: "Error updating contract", error });
  }
};

module.exports = putPlantillaDeContrato;
