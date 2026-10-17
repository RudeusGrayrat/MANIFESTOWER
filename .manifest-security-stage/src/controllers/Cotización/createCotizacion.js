const Cotizacion = require("../../models/Cotizacion");
const generarCorrelativa = require("./generateCorrelative");

const createCotizacion = async (req, res) => {
  try {
    const {
      cliente,
      ruc,
      direction,
      condition,
      oferta,
      fechaOperacion,
      fechaVencimiento,
      contactDirectory,
      chargeDirectory,
      phoneCodeDirectory,
      phoneNumberDirectory,
      emailDirectory,
      otherData,
      observation,
      registros,
      subTotal,
      igv,
      total,
    } = req.body;

    if (
      !cliente ||
      !ruc ||
      !direction ||
      !condition ||
      !oferta ||
      !fechaOperacion ||
      !fechaVencimiento ||
      !contactDirectory ||
      !chargeDirectory ||
      !phoneCodeDirectory ||
      !phoneNumberDirectory ||
      !emailDirectory ||
      !registros ||
      !subTotal ||
      !igv ||
      !total
    ) {
      return res.status(400).json({
        message: "No se recibieron todos los campos requeridos",
      });
    }
    const [day, month, year] = fechaOperacion.split("/");
    const fechaOperacionDate = new Date(`${year}/${month}/${day}`);
    const [dayVenc, monthVenc, yearVenc] = fechaVencimiento.split("/");
    const fechaVencimientoDate = new Date(
      `${yearVenc}/${monthVenc}/${dayVenc}`
    );
    const correlativa = await generarCorrelativa(fechaOperacionDate);

    const cotizacion = new Cotizacion({
      correlativa,
      cliente,
      ruc,
      direction,
      condition,
      oferta,
      fechaOperacion: fechaOperacionDate,
      fechaVencimiento: fechaVencimientoDate,
      contactDirectory,
      chargeDirectory,
      phoneCodeDirectory,
      phoneNumberDirectory,
      emailDirectory,
      otherData,
      observation,
      registros,
      subTotal,
      igv,
      total,
    });

    await cotizacion.save();

    return res.status(201).json({
      message: "Cotizacion created successfully",
      cotizacion,
    });
  } catch (error) {
    return res.status(500).json({
      mesasage: error.message,
    });
  }
};

module.exports = createCotizacion;
