const Client = require("../../models/Client");
const { hashPassword } = require("../../utils/bcrypt");

const updateClient = async (req, res) => {
  const {
    _id,
    razonsocial,
    ruc,
    direction,
    phoneCode,
    phoneNumber,
    email,
    password,
    economicSector,
    condition,
    directory,
  } = req.body;

  try {
    const userFound = await Client.findById(_id);

    if (!userFound) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (razonsocial) userFound.razonsocial = razonsocial;
    if (ruc) userFound.ruc = ruc;
    if (direction) userFound.direction = direction;
    if (phoneCode) userFound.phoneCode = phoneCode;
    if (phoneNumber) userFound.phoneNumber = phoneNumber;
    if (directory) userFound.directory = directory;
    if (email) userFound.email = email;
    if (economicSector) userFound.economicSector = economicSector;
    if (condition) userFound.condition = condition;

    if (password) {
      userFound.password = await hashPassword(password);
    }

    await userFound.save();

    return res.status(200).json({
      message: "Usuario actualizado correctamente",
      updatedUser: userFound,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = updateClient;
