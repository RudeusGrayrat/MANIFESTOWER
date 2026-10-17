const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const contratoAlmacenSchema = new Schema(
  {
    cliente: { type: String, required: true },
    sedeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sede",
      required: true,
    },
    fechaInicio: {
      type: String,
      required: true,
    },
    fechaFin: {
      type: String,
      required: true,
    },
    estado: {
      type: String,
      enum: ["ACTIVO", "INACTIVO", "FINALIZADO", "CANCELADO", "PENDIENTE"],
      default: "ACTIVO",
    },
  },
  {
    timestamps: true,
  }
);

const ContratoAlmacen = mongoose.model("Contrato", contratoAlmacenSchema);
module.exports = ContratoAlmacen;
