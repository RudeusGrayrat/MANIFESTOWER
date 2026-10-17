const mongoose = require("mongoose");

const antivirusSchema = new mongoose.Schema({
  antivirus: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AllAntivirus",
    required: true,
  },
  fechaInstalacion: {
    type: Date,
    required: true,
  },
  fechaVencimiento: {
    type: Date,
    required: true,
  },
  estado: {
    type: String,
    enum: ["ACTIVO", "INACTIVO"],
    default: "ACTIVO",
  },
  usuarioInstalador: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
  },
  equipo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Inventario",
    required: true,
  },
});

const antivirus = mongoose.model("antivirus", antivirusSchema);

module.exports = antivirus;
