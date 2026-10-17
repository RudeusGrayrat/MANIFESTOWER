const mongoose = require("mongoose");
const rackSchema = require("./Rack");
const { Schema } = mongoose;

const zonaSchema = new Schema(
  {
    nombre: { type: String, required: true },
    almacenId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Almacen",
      required: true,
    },
    orientacion: {
      type: String,
      enum: ["HORIZONTAL", "VERTICAL"],
      default: "HORIZONTAL",
    },
    racks: [rackSchema],
  },
  {
    timestamps: true,
  }
);

const Zona = mongoose.model("Zona", zonaSchema);
module.exports = Zona;
