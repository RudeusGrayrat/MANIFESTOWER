const mongoose = require("mongoose");
const { Schema } = mongoose;

const inventarioSistemasSchema = new Schema(
  {
    codigo: {
      type: String,
      unique: true,
      required: true,
    },
    categoria: {
      type: String,
      required: true,
    },
    marca: {
      type: String,
      required: true,
    },
    modelo: {
      type: String,
      required: true,
    },
    especificaciones: {
      type: String,
      required: true,
    },
    area: {
      type: String,
    },
    sede: {
      type: String,
    },
    estado: {
      type: String,
      enum: ["ACTIVO", "INACTIVO"],
      default: "ACTIVO",
    },
    observaciones: {
      type: String,
    },
  },
  { timestamps: true }
);

const InventarioSistemas = mongoose.model(
  "InventarioSistemas",
  inventarioSistemasSchema
);

module.exports = InventarioSistemas;
