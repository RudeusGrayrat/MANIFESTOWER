const Client = require("../../models/Client");
const { hashPassword } = require("../../utils/bcrypt");

const createClient = async (req, res) => {
  try {
    const {

      razonSocial,
      ruc,
      direction,
      phoneCode,
      phoneNumber,
      email,
      economicSector,
      condition,
    password,
    directory,
    } = req.body;

    if (
      !razonSocial ||
      !ruc ||
      !direction ||
      !phoneCode ||
      !phoneNumber ||
      !email ||
      !economicSector ||
      !condition ||
      !password 
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
    const userFound = await Client.findOne({ ruc });
    if (userFound)
      return res.status(400).json({
        message: "Usuario ya existente",
      });

    if (directory && directory.length === 0) {
      return res.status(400).json({
        message: "All elements of directory are required",
      });

    }
    const hashedPassword = await hashPassword(password);

    const client = new Client({
      razonSocial,
      ruc,
      direction,
      phoneCode,
      phoneNumber,
      email,
      economicSector,
      condition,
      directory,
      password: hashedPassword,
    });

    await client.save();

    return res
      .status(201)
      .json({ message: "Client created successfully", client });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create client",
      error: error.message,
    });
  }
};

module.exports = createClient;
