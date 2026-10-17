const Movimiento = require("../../../../models/AllModulos/Almacen/Movimiento");

const generarCorrelativa = async (tipo, contrato, contratoId) => {
  try {
    const now = new Date();
    const año = now.getFullYear().toString().slice(2); // ejemplo: 2025 → "25"
    const aliasCliente = contrato.substring(0, 3);
    const prefijo = tipo === "INGRESO" ? "CI" : "CS";

    // Buscar la última correlativa del año y tipo
    const ultMovimiento = await Movimiento.findOne({
      movimiento: tipo,
      contratoId,
      correlativa: { $regex: `^${prefijo}${año}` },
    })
      .sort({ createdAt: -1 })
      .lean();

    let nuevoNumero = 1;

    if (ultMovimiento?.correlativa) {
      const match = ultMovimiento.correlativa.match(/(\d{5})$/);
      const numero = match ? parseInt(match[1]) : 1;
      nuevoNumero = numero + 1;
    }

    const correlativoStr = nuevoNumero.toString().padStart(5, "0");
    return `${prefijo}${año}-${aliasCliente}${correlativoStr}`;
  } catch (error) {
    console.error("Error al generar correlativa:", error.message);
    throw error;
  }
};

module.exports = generarCorrelativa;
