const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const plantillasDeContratoSchema = new Schema(
  {
    state: {
      enum: ["ACTIVO", "INACTIVO"],
      type: String,
      required: true,
      default: "ACTIVO",
    },
    tipoContrato: {
      type: String,
      required: true,
    },
    archivo: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const PlantillasDeContrato = mongoose.model(
  "PlantillasDeContrato",
  plantillasDeContratoSchema
);

module.exports = PlantillasDeContrato;
