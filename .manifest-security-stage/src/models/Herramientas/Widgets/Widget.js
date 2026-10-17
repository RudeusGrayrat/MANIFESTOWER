const mongoose = require("mongoose");
const { Schema } = mongoose;

const widgetSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    key: {
      type: String,
      required: true,
      unique: true,
    },
    descripcion: {
      type: String,
    },
    imagen: {
      type: String,
      required: true,
    },
    grupo: {
      type: String,
      required: true,
    },
    
  },
  { timestamps: true }
);

const Widget = mongoose.model("Widget", widgetSchema);

module.exports = Widget;
