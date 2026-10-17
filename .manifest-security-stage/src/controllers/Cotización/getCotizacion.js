const Cotizacion = require("../../models/Cotizacion");

const getCotizaciones = async (req, res) => {

    try {
        const cotizacion = await Cotizacion.find();

        // Send the cotizacion data as a response
        res.status(200).json(cotizacion);
    } catch (error) {
        // Handle any errors that occur during the process
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = getCotizaciones;