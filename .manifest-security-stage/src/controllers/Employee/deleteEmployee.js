const Employee = require("../../models/Employees/Employee");

const deleteEmployee = async (req, res) => {
  const { _id } = req.body;

  try {

    const userDelete = await Employee.findByIdAndDelete(_id);

    if (!userDelete) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    return res.status(200).json({
      message: "Usuario eliminado correctamente",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = deleteEmployee;
