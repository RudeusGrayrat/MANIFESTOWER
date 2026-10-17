const Widget = require("../../../models/Herramientas/Widgets/Widget");

const postWidget = async (req, res) => {
  try {
    const { name, key, descripcion, imagen, grupo } = req.body;
    console.log("req.body", req.body);

    if (!name || !key || !imagen || !grupo) {
      return res.status(400).json({ message: "Faltan datos" });
    }

    const newWidget = await new Widget({
      name,
      key,
      descripcion,
      imagen,
      grupo,
    });
    await newWidget.save();
    res.status(201).json({ message: "Widget creado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = postWidget;
