const DatosContables = require("../../../../models/RecursosHumanos/DatosContablesBoleta");

const getDatosContables = async (req, res) => {
  try {
    const datos = await DatosContables.find();
    if (!datos) {
      return res
        .status(404)
        .json({ message: "Datos contables no encontrados" });
    }
    return res.status(200).json(datos);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = getDatosContables;
