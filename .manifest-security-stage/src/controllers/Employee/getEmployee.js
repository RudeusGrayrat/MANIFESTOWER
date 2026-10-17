const Employee = require("../../models/Employees/Employee");

const getEmployee = async (req, res) => {
  try {
    const userFind = await Employee.find()
    if (!userFind) {
      return res.status(404).json({ message: "No se encontraron empleados" });
    }
    return res.status(200).json(userFind);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

module.exports = getEmployee;
