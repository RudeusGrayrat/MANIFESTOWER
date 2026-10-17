const Movimiento = require("../../../../models/AllModulos/Almacen/Movimiento");

const actualizarCorrelativas = async (
  correlativaEliminada,
  contratoId,
  movimiento
) => {
  try {
    const match = correlativaEliminada.match(/^([A-Z]+\d{2}-[A-Z]+)(\d{5})$/);
    if (!match) throw new Error("Formato de correlativa inválido");

    const prefijo = match[1]; // CI25-SUN
    const añoPrefijo = prefijo.slice(2, 4); // "25"

    // Buscar todos los movimientos válidos con el mismo prefijo (sin el que fue eliminado)
    const movimientos = await Movimiento.find({
      contratoId,
      movimiento,
      correlativa: { $regex: `^${prefijo}\\d{5}$` },
    }).sort({ correlativa: 1 }); // orden ascendente

    let nuevoNumero = 1;

    for (const mov of movimientos) {
      const nuevaCorrelativa = `${prefijo}${nuevoNumero
        .toString()
        .padStart(5, "0")}`;

      // Evita sobreescribir si es igual
      if (mov.correlativa !== nuevaCorrelativa) {
        mov.correlativa = nuevaCorrelativa;
        await mov.save();
      }

      nuevoNumero++;
    }

    return { totalActualizados: nuevoNumero - 1 };
  } catch (error) {
    console.error("Error al actualizar correlativas:", error.message);
    throw error;
  }
};

module.exports = actualizarCorrelativas;
