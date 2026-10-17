const mongoose = require('mongoose');

const unidadMedidaSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    abbreviation: {
        type: String,
        required: true
    },
    description: {
        type: String,
    }
});

const UnidadMedida = mongoose.model('UnidadMedida', unidadMedidaSchema);

module.exports = UnidadMedida;