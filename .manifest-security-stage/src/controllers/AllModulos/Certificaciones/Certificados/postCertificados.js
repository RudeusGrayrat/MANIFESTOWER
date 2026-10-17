const Certificado = require("../../../../models/Certificacion/Certificados");

const postCertificado = async (req, res) => {
  const { name, archivo, fecha } = req.body;

  try {
    if (!name || !archivo || !fecha) {
      return res.status(400).json({ message: "Faltan campos por llenar" });
    }
    const certificado = new Certificado({
      name,
      archivo,
      fecha,
    });
    await certificado.save();

    return res.status(200).json({
      message: "Certificado creado correctamente",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = postCertificado;
