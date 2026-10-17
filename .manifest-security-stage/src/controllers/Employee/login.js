const { compare } = require("bcrypt");
const generatetoken = require("../../utils/jwt");
const Employee = require("../../models/Employees/Employee");
const generateSupertoken = require("../auth/superToken");

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Falta email o password" });
    }
    const user = await Employee.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    const userData = user.toObject();
    delete userData.password;

    let token;
    if (userData.role === "superadmin") {
      token = generateSupertoken(userData);
    } else {
      token = generatetoken(userData);
    }

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    return res.status(200).json({
      data: userData,
      token: token,
    });
  } catch (error) {
    return res.status(500).json({ message: message.error });
  }
};

module.exports = login;
