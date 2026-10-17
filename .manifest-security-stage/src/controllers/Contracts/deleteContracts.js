const Contract = require("../../models/Contracts");

const deleteContract = async (req, res) => {
  const { _id } = req.body;

  try {
    const contractDelete = await Contract.findByIdAndDelete(_id);

    if (!contractDelete) {
      return res.status(404).json({ message: "Contrato no encontrado" });
    }

    return res.status(200).json({
      message: "Contrato eliminado correctamente",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = deleteContract;
