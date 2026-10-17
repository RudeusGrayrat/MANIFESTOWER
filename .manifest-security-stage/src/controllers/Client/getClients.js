const Client = require("../../models/Client");

const getClients = async (req, res) => {
    try {
        const clients = await Client.find();
        res.status(200).json(clients);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = getClients;