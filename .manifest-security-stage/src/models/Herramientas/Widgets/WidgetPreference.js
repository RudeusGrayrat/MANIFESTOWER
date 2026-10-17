const mongoose = require("mongoose");

const WidgetPreferenceSchema = new mongoose.Schema(
  {
    widgets: [
      {
        widget: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Widget",
          required: true,
        },
        orden: {
          type: Number,
          required: true,
        },
      },
    ],
    colaborador: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
  },
  { timestamps: true }
);

const WidgetPreference = mongoose.model(
  "WidgetPreference",
  WidgetPreferenceSchema
);

module.exports = WidgetPreference;
