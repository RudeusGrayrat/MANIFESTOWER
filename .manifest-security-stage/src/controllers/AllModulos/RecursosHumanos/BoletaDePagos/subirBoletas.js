const BoletaDePagos = require("../../../../models/RecursosHumanos/BoletaDePago");

// Controller function to upload payment slips from JSON
const subirBoletas = async (req, res) => {
  try {
    const fs = require("fs");
    const path = require("path");
    const boletasDePago = JSON.parse(
      fs.readFileSync(path.join(__dirname, "boletaDePagos.json"), "utf-8")
    );
    await BoletaDePagos.insertMany(boletasDePago);
    return res
      .status(201)
      .json({ message: "Boletas de Pago cargados desde JSON" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = subirBoletas;
