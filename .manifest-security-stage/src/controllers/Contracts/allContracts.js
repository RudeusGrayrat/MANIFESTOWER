const Contract = require("../../models/Contracts");

const allContracts = async (req, res) => {
  try {
    const contracts = await Contract.find().populate("colaborador");
    res.status(200).json(contracts);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving contracts", error });
  }
};

module.exports = allContracts;
