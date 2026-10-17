const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

const validationToken = (req, res, next) => {
    const { token } = req?.cookies;
    if (!token) {
        return res.status(401).json({
            message: "No hay token "
        })
    }
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) res.status(403).json({ message: err })
        req.user = user
        next()
    })

}
module.exports = validationToken
