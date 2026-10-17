const mongoose = require("mongoose");
const { Schema } = mongoose;

const historialSchema = new Schema(
  {
    entidad: {
      type: String,
      required: true,
    }, // Ej: "Ubicacion", "Ingreso", "Producto", "Salida"

    entidadId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    }, // El _id del documento modificado

    accion: {
      type: String,
      enum: ["creado", "modificado", "eliminado", "movido"],
      required: true,
    },

    usuarioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    }, // Quién hizo el cambio

    cambios: [
      {
        campo: String, // Ej: "cantidad", "estado"
        antes: Schema.Types.Mixed,
        despues: Schema.Types.Mixed,
      },
    ],

    motivo: String, // opcional: por qué se hizo el cambio
  },
  {
    timestamps: true, // incluye createdAt = fecha del cambio
  }
);

const Historial = mongoose.model("Historial", historialSchema);
module.exports = Historial;
