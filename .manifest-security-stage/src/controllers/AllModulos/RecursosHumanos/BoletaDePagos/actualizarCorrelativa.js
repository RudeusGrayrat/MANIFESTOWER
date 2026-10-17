const BoletaDePagos = require("../../../../models/RecursosHumanos/BoletaDePago");

const actualizarCorrelativas = async (correlativaEliminada) => {
  try {
    const result = await BoletaDePagos.updateMany(
      { correlativa: { $gt: correlativaEliminada } },
      { $inc: { correlativa: -1 } }
    );
    return result;
  } catch (error) {
    throw ("Error al actualizar las correlativas:", error.message);
  }
};

module.exports = actualizarCorrelativas;
