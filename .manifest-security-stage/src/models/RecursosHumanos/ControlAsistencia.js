const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const controlAsistenciaSchema = new Schema({
  fecha: {
    type: String,
    required: true,
  },
  desde: {
    type: String,
    required: true,
  },
  hasta: {
    type: String,
    required: true,
  },
  colaborador: { 
    type: Schema.Types.ObjectId,
    ref: "Employee",
  },
  tipo: {
    type: String,
    enum: ["VACACIONES", "PERMISO", "HORAS EXTRAS", "SUSPENSION"],
  },
  observacion: {
    type: String,
  },
});

const controlAsistencia = mongoose.model(
  "controlAsistencia",
  controlAsistenciaSchema
);

module.exports = controlAsistencia;
