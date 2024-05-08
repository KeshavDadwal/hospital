const jwt = require('jsonwebtoken');
function verifyToken(req, res, next) {
    const token = req.headers['X-Access-Token'] || req.query.token;
    if (!token) {
        return res.status(401).json({ success: false, message: 'No token provided' });
    }
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({ success: false, message: 'Failed to authenticate token' });
        } else {
            req.decoded = decoded;
            next();
        }
    });
}

module.exports = verifyToken;
