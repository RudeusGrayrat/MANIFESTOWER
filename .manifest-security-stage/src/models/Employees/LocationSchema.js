const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const locationSchema = new Schema({
  departamento: {
    type: String,
  },
  provincia: {
    type: String,
  },
  distrito: {
    type: String,
  },
  direccion: {
    type: String,
  },
});

module.exports = locationSchema;
