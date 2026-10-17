const mongoose = require("mongoose");

const clientSchema = mongoose.Schema(
  {
    razonSocial: {
      type: String,
      required: true,
    },
    ruc: {
      type: String,
      required: true,
      unique: true,
    },
    direction: {
      type: String,
      required: true,
    },
    phoneCode: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    economicSector: {
      type: String,
      required: true,
    },
    condition: {
      type: String,
      required: true,
    },
    directory: [
      {
        name: {
          type: String,
          required: true,
        },
        charge: {
          type: String,
          required: true,
        },
        phoneCodeDirectory: {
          type: String,
          required: true,
        },
        phoneNumberDirectory: {
          type: String,
          required: true,
        },
        emailDirectory: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

const Client = mongoose.model("Client", clientSchema);
module.exports = Client;
