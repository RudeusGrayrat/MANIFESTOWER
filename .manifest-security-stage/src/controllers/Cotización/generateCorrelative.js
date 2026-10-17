const Cotizacion = require("../../models/Cotizacion");

const generarCorrelativa = async (fechaOperacion) => {
  try {
    const año = fechaOperacion.getFullYear().toString().slice(2);
    const correlativaBase = `${año}`;

    // Busca la última correlativa para el año específico
    const ultimaCotizacion = await Cotizacion.findOne({
      correlativa: {
        $gte: Number(`${correlativaBase}00`), // Al menos los dos primeros dígitos
      },
    })
      .sort({ correlativa: -1 })
      .limit(1);

    let nuevoNumero;

    if (ultimaCotizacion) {
      // Extrae el número de la última correlativa y lo incrementa
      const ultimaCorrelativa = parseInt(
        ultimaCotizacion.correlativa.toString().slice(2),
        10
      );
      // Verificar que ultimaCorrelativa es un número válido
      if (isNaN(ultimaCorrelativa)) {
        throw new Error(
          `La última correlativa no es válida: ${ultimaCotizacion.correlativa}`
        );
      }

      nuevoNumero = ultimaCorrelativa + 1;
    } else {
      // Si no hay correlativas previas, comenzamos en 1
      nuevoNumero = 1;
    }

    // Formato final
    const nuevaCorrelativa = Number(
      `${correlativaBase}${nuevoNumero.toString().padStart(5, "0")}`
    );

    // Verificar que nuevaCorrelativa es un número válido
    if (isNaN(nuevaCorrelativa)) {
      throw new Error(
        `La nueva correlativa generada no es válida: ${nuevaCorrelativa}`
      );
    }

    return nuevaCorrelativa;
  } catch (error) {
    throw ("Error al generar la correlativa:", error.message);
  }
};

module.exports = generarCorrelativa;
