const dayjs = require("dayjs");
const BoletaDePagos = require("../../../../models/RecursosHumanos/BoletaDePago");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");

dayjs.extend(utc);
dayjs.extend(timezone);

const recepcionBoleta = async (req, res) => {
  const { boletaId } = req.query;
  try {

    if (boletaId) {
      const fechaRecepcion = new Date();
      const fechaRecepcionFormatted = dayjs(fechaRecepcion)
        .tz("America/Lima")
        .format("DD/MM/YYYY hh:mm A");
      const foundBoleta = await BoletaDePagos.findById(boletaId);
      if (!foundBoleta) {
        return res.status(404).json({ message: "Boleta no encontrada" });
      }
      if (foundBoleta.recepcion) {
        return res.status(400).json({ message: "Boleta ya recibida" });
      }
      foundBoleta.recepcion = fechaRecepcionFormatted;
      await foundBoleta.save();
      console.log(`Boleta ${boletaId} abierta el ${fechaRecepcionFormatted}`);
    } else {
      console.log("No se ha recibido el ID de la boleta");

    }

    const pixel = Buffer.from(
      "R0lGODlhAQABAAAAACwAAAAAAQABAAA=",
      "base64"
    );
    res.writeHead(200, {
      "Content-Type": "image/gif",
      "Content-Length": pixel.length,
    });
    res.end(pixel);
  } catch (error) {
    res.status(500).json({
      message: "Error al recibir la boleta",
      error: error.message,
    });
  }
};

module.exports = recepcionBoleta;
