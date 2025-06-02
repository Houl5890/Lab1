const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Немає токена' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
        req.userId = decoded.id || decoded._id; 
        next();
    } catch (err) {
        console.error('JWT decode error:', err);
        res.status(401).json({ error: 'Недійсний токен' });
    }
};

module.exports = authMiddleware;
