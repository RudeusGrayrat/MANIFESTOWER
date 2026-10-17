const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const sedeSchema = new Schema(
  {
    nombre: {
      type: String,
      required: true,
    },
    direccion: String,
    ciudad: String,
    departamento: String,
    pais: String,
    estado: {
      type: String,
      enum: ["ACTIVO", "INACTIVO"],
      default: "ACTIVO",
    },
  },
  {
    timestamps: true,
  }
);

const Sede = mongoose.model("Sede", sedeSchema);
module.exports = Sede;
