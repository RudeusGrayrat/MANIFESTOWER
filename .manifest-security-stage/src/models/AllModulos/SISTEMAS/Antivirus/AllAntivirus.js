const mongoose = require("mongoose");

const AllAntivirusSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  version: {
    type: String,
    required: true,
  },
  licencia: {
    type: String,
    required: true,
  },
  cantidadLicencias: {
    type: Number,
    required: true,
  },
}, {
    timestamps: true,
});

const AllAntivirus = mongoose.model("AllAntivirus", AllAntivirusSchema);

module.exports = AllAntivirus;
