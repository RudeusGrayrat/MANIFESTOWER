require("dotenv").config();
const jwt = require("jsonwebtoken");
const { MASTER_TOKEN } = process.env;

const generateSupertoken = (user) => {
  const expiresIn = "43800h"; // 5 años en horas
  try {
    const payload = { _id: user._id, email: user.email, role: user.role };
    return jwt.sign(payload, MASTER_TOKEN, { expiresIn });
  } catch (error) {
    throw new Error("Error al generar el token", error);
  }
};

module.exports = generateSupertoken;
