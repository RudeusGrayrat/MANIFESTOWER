const BoletaDePagos = require("../../../../models/RecursosHumanos/BoletaDePago");

const generarCorrelativa = async (fechaOperacion) => {
  try {
    const añoActual = fechaOperacion.getFullYear().toString().slice(2);
    const correlativaBase = `${añoActual}`;

    const ultimaCotizacion = await BoletaDePagos.findOne({
      correlativa: {
        $gte: Number(`${correlativaBase}00001`), // Busca correlativas para el año actual, por ejemplo, 2400001
        $lt: Number(`${correlativaBase}99999`), // Asegura que busque correlativas solo para el año actual, por ejemplo, hasta 2499999
      },
    })
      .sort({ correlativa: -1 }) // Ordenamos de mayor a menor para obtener la última correlativa
      .limit(1);
    let nuevoNumero;

    if (ultimaCotizacion) {
      const ultimaCorrelativa = parseInt(
        ultimaCotizacion.correlativa.toString().slice(2), // Obtenemos solo los números después del año (por ejemplo 000001)
        10
      );

      if (isNaN(ultimaCorrelativa)) {
        throw new Error(
          `La última correlativa no es válida: ${ultimaCotizacion.correlativa}`
        );
      }

      nuevoNumero = ultimaCorrelativa + 1; // Incrementamos el número secuencial
    } else {
      // Si no hay correlativas previas, comenzamos en 1
      nuevoNumero = 1;
    }

    // Generamos la nueva correlativa con el año y el número secuencial incrementado
    const nuevaCorrelativa = Number(
      `${correlativaBase}${nuevoNumero.toString().padStart(5, "0")}` // Asegura que el número tenga 6 dígitos
    );

    // Verificar que la nueva correlativa es un número válido
    if (isNaN(nuevaCorrelativa)) {
      throw new Error(
        `La nueva correlativa generada no es válida: ${nuevaCorrelativa}`
      );
    }


    return nuevaCorrelativa; // Devolvemos la nueva correlativa generada
  } catch (error) {
    console.error("Error al generar la correlativa:", error.message);
    throw error; // Lanza el error para que pueda ser manejado donde se llame esta función
  }
};

module.exports = generarCorrelativa;
