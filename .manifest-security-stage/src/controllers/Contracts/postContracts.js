const Contract = require("../../models/Contracts");

const postContracts = async (req, res) => {
  const {
    typeContract,
    dateStart,
    dateEnd,
    cargo,
    colaborador,
    codigoSPP,
    regimenPension,
  } = req.body;

  try {
    if (!typeContract || !dateStart || !dateEnd || !colaborador) {
      return res.status(400).json({ message: "Faltan Datos" });
    }
    const newContract = new Contract({
      typeContract,
      dateStart,
      dateEnd,
      cargo,
      colaborador,
      regimenPension,
      codigoSPP,
    });

    const savedContract = await newContract.save();
    return res.status(201).json({ message: "Contrato Creado", savedContract });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = postContracts;
