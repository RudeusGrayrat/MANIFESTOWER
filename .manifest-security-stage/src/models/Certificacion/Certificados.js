const mongoose = require("mongoose");

const certificadoSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    archivo: {
      type: String,
      required: true,
    },
    fecha: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Certificado = mongoose.model("certificado", certificadoSchema);

module.exports = Certificado;
