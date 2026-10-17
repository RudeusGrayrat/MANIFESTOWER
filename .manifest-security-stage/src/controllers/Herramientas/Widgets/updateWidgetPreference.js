const WidgetPreference = require("../../../models/Herramientas/Widgets/WidgetPreference");

const updateWidgetPreference = async (req, res) => {
  const { colaborador, widgets } = req.body;
  try {
    const updated = await WidgetPreference.findOneAndUpdate(
      { colaborador },
      { $set: { widgets } },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: "No se encontró el widget" });
    }
    return res
      .status(200)
      .json({ message: "Widgets actualizados correctamente" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = updateWidgetPreference;
