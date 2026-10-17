const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");
const Employee = require("../../../../../models/Employees/Employee");
const AsistenciaColaborador = require("../../../../../models/RecursosHumanos/AsistenciaColaborador");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

dayjs.extend(utc);
dayjs.extend(timezone);

async function marcarAsistenciaAutomatica() {
  try {
    if (!process.env.DATABASE_URL) {
      console.error("❌ DATABASE_URL no está definido.");
      return;
    }

    await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
    });

    console.log("✅ Conexión a MongoDB establecida");

    const hoy = dayjs().tz("America/Lima");
    const diaSemana = hoy.day();

    if (diaSemana === 0) {
      console.log("⏩ Hoy es domingo, no se registra asistencia.");
      return;
    }

    const fechaHoy = hoy.format("DD/MM/YYYY");

    const defaultData = {
      ingreso: "00:00",
      salida: "00:00",
      inicioAlmuerzo: "00:00",
      finAlmuerzo: "00:00",
      minExtras: "0",
      minTarde: "0",
      estado: "FALTA",
    };

    const asistenciaAutomaticaData =
      diaSemana === 6
        ? {
            ingreso: "08:00 AM",
            salida: "1:00 PM",
            inicioAlmuerzo: "00:00",
            finAlmuerzo: "00:00",
            minExtras: "0",
            minTarde: "0",
            estado: "PRESENTE",
          }
        : {
            ingreso: "08:00 AM",
            salida: "5:30 PM",
            inicioAlmuerzo: "1:00 PM",
            finAlmuerzo: "2:00 PM",
            minExtras: "0",
            minTarde: "0",
            estado: "PRESENTE",
          };

    const colaboradores = await Employee.find({ state: "ACTIVO" });
    const asistenciasHoy = await AsistenciaColaborador.find({
      fecha: fechaHoy,
    }).lean();

    const asistenciaMap = new Map(
      asistenciasHoy.map((a) => [a.colaborador.toString(), a])
    );

    const bulkOps = [];

    for (const empleado of colaboradores) {
      const findAsistenciaHoy = asistenciaMap.get(empleado._id.toString());

      if (findAsistenciaHoy) {
        bulkOps.push({
          updateOne: {
            filter: { _id: findAsistenciaHoy._id },
            update: {
              $set:
                findAsistenciaHoy.estado === "FALTA"
                  ? asistenciaAutomaticaData
                  : findAsistenciaHoy,
            },
          },
        });
      } else {
        const dataToPost =
          empleado.asistenciaAutomatica === "SI"
            ? asistenciaAutomaticaData
            : defaultData;
        bulkOps.push({
          insertOne: {
            document: {
              colaborador: empleado._id,
              fecha: fechaHoy,
              ...dataToPost,
            },
          },
        });
      }
    }

    try {
      if (bulkOps.length > 0) {
        await AsistenciaColaborador.bulkWrite(bulkOps);
        console.log(`✅ Se registraron ${bulkOps.length} asistencias.`);
      } else {
        console.log("ℹ️ No hay asistencias que registrar.");
      }
    } catch (bulkError) {
      console.error("❌ Error en bulkWrite:", bulkError);
    }
  } catch (error) {
    console.error("❌ Error en asistencia automática:", {
      message: error.message,
      stack: error.stack,
    });
  } finally {
    mongoose.connection.close().catch(console.error);
    console.log("🔌 Conexión a MongoDB cerrada");
  }
}

marcarAsistenciaAutomatica();
