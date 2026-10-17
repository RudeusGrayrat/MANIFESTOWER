const mongoose = require("mongoose");

const cotizacionSchema = mongoose.Schema({
  correlativa: {
    type: Number,
    required: true,
    unique: true,
  },
  cliente: {
    type: String,
    required: true,
  },
  ruc: {
    type: String,
    required: true,
  },
  direction: {
    type: String,
    required: true,
  },
  condition: {
    type: String,
    required: true,
  },
  oferta: {
    type: String,
    required: true,
  },
  fechaOperacion: {
    type: Date,
    required: true,
  },
  fechaVencimiento: {
    type: Date,
    required: true,
  },
  moneda: {
    type: String,
    required: true,
  },
  contactDirectory: {
    type: String,
    required: true,
  },
  chargeDirectory: {
    type: String,
    required: true,
  },
  phoneCodeDirectory: {
    type: String,
    required: true,
  },
  phoneNumberDirectory: {
    type: String,
    required: true,
  },
  emailDirectory: {
    type: String,
    required: true,
  },
  otherData: {
    type: String,
  },
  observation: {
    type: String,
  },
  registros: [
    {
      service: {
        type: String,
        required: true,
      },
      typeService: {
        type: String,
        required: true,
      },
      typeWaste: {
        type: String,
        required: true,
      },
      measure: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      priceWithoutIGV: {
        type: Number,
        required: true,
      },
      priceWithIGV: {
        type: Number,
        required: true,
      },
      subTotal: {
        type: Number,
        required: true,
      },
    },
  ],
  state: {
    type: String,
    default: "Pendiente",
  },
  subTotal: {
    type: Number,
    required: true,
  },
  igv: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
});

const Cotizacion = mongoose.model("Cotizacion", cotizacionSchema);

module.exports = Cotizacion;
