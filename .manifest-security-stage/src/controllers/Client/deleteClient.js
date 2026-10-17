const Client = require("../../models/Client");

const deleteClient = async (req, res) => {
  try {
    const { _id } = req.body;
    const client = await Client.findByIdAndDelete(_id);

    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }

    res.json({ message: "Client deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = deleteClient;
