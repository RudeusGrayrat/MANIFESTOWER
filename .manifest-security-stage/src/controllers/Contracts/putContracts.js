const Contract = require("../../models/Contracts");

const putContracts = async (req, res) => {
  const {
    _id,
    typeContract,
    state,
    dateStart,
    dateEnd,
    cargo,
    sueldo,
    colaborador,
    codigoSpp,
    regimenPension,
  } = req.body;

  try {
    const updatedContract = await Contract.findById(_id);
    if (!updatedContract) {
      return res.status(404).json({ message: "Contrato no encontrado" });
    }
    if (typeContract) updatedContract.typeContract = typeContract;
    if (dateStart) updatedContract.dateStart = dateStart;
    if (dateEnd) updatedContract.dateEnd = dateEnd;
    if (cargo) updatedContract.cargo = cargo;
    if (sueldo) updatedContract.sueldo = sueldo;
    if (colaborador) updatedContract.colaborador = colaborador;
    if (state) updatedContract.state = state;
    if (codigoSpp) updatedContract.codigoSpp = codigoSpp;
    if (regimenPension) updatedContract.regimenPension = regimenPension;

    await updatedContract.save();

    return res
      .status(200)
      .json({ message: "Contrato actualizado correctamente" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = putContracts;
