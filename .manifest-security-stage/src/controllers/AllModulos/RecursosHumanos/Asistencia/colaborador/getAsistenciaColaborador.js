const AsistenciaColaborador = require("../../../../../models/RecursosHumanos/AsistenciaColaborador");

const getAllAsistenciaColaborador = async (req, res) => {
  try {
    const asistencia = await AsistenciaColaborador.find().populate(
      "colaborador",
      "name lastname photo documentType documentNumber state charge business sede type"
    );

    if (!asistencia || asistencia.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron Asistencias de Colaboradores" });
    }

    return res.status(200).json(asistencia);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = getAllAsistenciaColaborador;
