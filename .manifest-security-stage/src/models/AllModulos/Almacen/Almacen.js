const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const almacenSchema = new Schema(
  {
    nombre: { type: String, required: true },
    sedeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sede",
      required: true,
    },
    naves: Number,
    descripcion: String,
  },
  {
    timestamps: true,
  }
);

const Almacen = mongoose.model("Almacen", almacenSchema);
module.exports = Almacen;
