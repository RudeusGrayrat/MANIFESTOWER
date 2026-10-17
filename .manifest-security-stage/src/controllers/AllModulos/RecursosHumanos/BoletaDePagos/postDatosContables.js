const DatosContables = require("../../../../models/RecursosHumanos/DatosContablesBoleta");

const postDatosContables = async (req, res) => {
  const { codigoPlame, concepto, tipo } = req.body;

  try {
    if (!codigoPlame && !concepto && !tipo) {
      const fs = require("fs");
      const path = require("path");
      const conceptosPlame = JSON.parse(
        fs.readFileSync(path.join(__dirname, "datosContables.json"), "utf-8")
      );
      await DatosContables.insertMany(conceptosPlame);
      return res
        .status(201)
        .json({ message: "Datos contables cargados desde JSON" });
    }
    if (!codigoPlame || !concepto || !tipo) {
      return res
        .status(400)
        .json({ message: "Por favor llena todos los campos correctamente" });
    }

    const datoFound = await DatosContables.findOne({ codigoPlame });
    if (datoFound) {
      return res.status(400).json({ message: "El dato contable ya existe" });
    }

    const dato = new DatosContables({
      codigoPlame,

      concepto,
      tipo,
    });
    await dato.save();

    return res
      .status(201)
      .json({ message: "Dato contable creado exitosamente" });
  } catch (error) {
    console.error("Error en postDatosContables:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

module.exports = postDatosContables;
