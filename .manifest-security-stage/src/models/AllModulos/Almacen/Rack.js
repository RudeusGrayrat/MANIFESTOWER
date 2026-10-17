const { Schema } = require("mongoose");

const rackSchema = new Schema({
  nombre: String,
  niveles: Number,
  seccionesPorNivel: Number,
});

module.exports = rackSchema;
