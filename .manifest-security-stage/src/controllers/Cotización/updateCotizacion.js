const Cotizacion = require("../../models/Cotizacion");

const updateCotizacionPartial = async (req, res) => {
  const {
    _id,
    cliente,
    ruc,
    direction,
    condition,
    oferta,
    fechaOperacion,
    fechaVencimiento,
    moneda,
    contactDirectory,
    chargeDirectory,
    phoneCodeDirectory,
    phoneNumberDirectory,
    emailDirectory,
    otherData,
    observation,
    registros,
    state,
    subTotal,
    igv,
    total,
  } = req.body;

  try {
    const cotizacionFound = await Cotizacion.findById(_id);

    if (!cotizacionFound) {
      return res.status(404).json({ message: "Cotización no encontrada" });
    }

    // Actualizar solo los campos que se envían en el request
    if (cliente) cotizacionFound.cliente = cliente;
    if (ruc) cotizacionFound.ruc = ruc;
    if (direction) cotizacionFound.direction = direction;
    if (condition) cotizacionFound.condition = condition;
    if (oferta) cotizacionFound.oferta = oferta;
    if (fechaOperacion) cotizacionFound.fechaOperacion = fechaOperacion;
    if (fechaVencimiento) cotizacionFound.fechaVencimiento = fechaVencimiento;
    if (moneda) cotizacionFound.moneda = moneda;
    if (contactDirectory) cotizacionFound.contactDirectory = contactDirectory;
    if (chargeDirectory) cotizacionFound.chargeDirectory = chargeDirectory;
    if (phoneCodeDirectory)
      cotizacionFound.phoneCodeDirectory = phoneCodeDirectory;
    if (phoneNumberDirectory)
      cotizacionFound.phoneNumberDirectory = phoneNumberDirectory;
    if (emailDirectory) cotizacionFound.emailDirectory = emailDirectory;
    if (otherData) cotizacionFound.otherData = otherData;
    if (observation) cotizacionFound.observation = observation;
    if (registros && registros.length > 0)
      cotizacionFound.registros = registros;
    if (state) cotizacionFound.state = state;
    if (subTotal) cotizacionFound.subTotal = subTotal;
    if (igv) cotizacionFound.igv = igv;
    if (total) cotizacionFound.total = total;

    await cotizacionFound.save();

    return res.status(200).json({
      message: "Cotización actualizada correctamente",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = updateCotizacionPartial;
