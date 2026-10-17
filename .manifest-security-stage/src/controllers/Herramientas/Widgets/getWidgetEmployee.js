const WidgetPreference = require("../../../models/Herramientas/Widgets/WidgetPreference");

const getWidgetEmployee = async (req, res) => {
  const { colaborador } = req.params;
  try {
    if (!colaborador) {
      return res.status(400).json({ message: "Faltan datos" });
    }
    const foundWidgetsPreference = await WidgetPreference.findOne({
      colaborador,
    }).populate("widgets.widget");
    if (!foundWidgetsPreference) {
      return res.status(404).json({ message: "No se encontraron widgets" });
    }
    return res.status(200).json(foundWidgetsPreference);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = getWidgetEmployee;
