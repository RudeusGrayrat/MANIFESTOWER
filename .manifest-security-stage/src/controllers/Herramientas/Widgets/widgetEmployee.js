const WidgetPreference = require("../../../models/Herramientas/Widgets/WidgetPreference");

const addWidgetEmployee = async (req, res) => {
  const { colaborador, orden, widget } = req.body;
  try {
    if (!colaborador || !orden || !widget) {
      return res.status(400).json({ message: "Faltan datos" });
    }
    const foundEmployee = await WidgetPreference.findOne({
      colaborador: colaborador,
    });
    if (!foundEmployee) {
      const newWidgetPreference = new WidgetPreference({
        colaborador: colaborador,
        widgets: [{ widget: widget, orden: orden }],
      });
      await newWidgetPreference.save();
    } else {
      const exists = foundEmployee.widgets.some(
        (w) => w.widget.toString() === widget
      );

      if (exists) {
        return res
          .status(409)
          .json({ message: "El widget ya ha sido agregado" });
      }

      foundEmployee.widgets.push({ widget, orden });
      await foundEmployee.save();
    }
    return res.status(200).json({ message: "Widget agregado correctamente" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = addWidgetEmployee;
