const mongoose = require("mongoose");

const notificationStateSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    notificationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Notification",
      required: true,
    },
    leido: {
      type: Boolean,
      default: false,
    },
    fechaLectura: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const NotificationState = mongoose.model(
  "NotificationState",
  notificationStateSchema
);

module.exports = NotificationState;
