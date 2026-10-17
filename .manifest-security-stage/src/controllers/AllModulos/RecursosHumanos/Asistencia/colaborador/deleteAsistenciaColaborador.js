const AsistenciaColaborador = require("../../../../../models/RecursosHumanos/AsistenciaColaborador");

const deleteAsistenciaColaborador = async (req, res) => {
  const { _id } = req.body;
  try {
    const asistencia = await AsistenciaColaborador.findByIdAndDelete(_id);
    if (!asistencia) {
      return res
        .status(404)
        .json({ message: "Asistencia de Colaborador no encontrada" });
    }
    return res
      .status(200)
      .json({ message: "Asistencia de Colaborador eliminada" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = deleteAsistenciaColaborador;
