const axios = require('axios');
const token = 'apis-token-9673.mLnoGZcIq3EpV-7zbESNk9CNfwR3kRAN';

const consulApi = async (req, res) => {
    const {numeroRuc} = req.query;
    try {
        const response = await axios.get(`https://api.apis.net.pe/v2/sunat/ruc?numero=${numeroRuc}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });
        return res.json(response.data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = consulApi