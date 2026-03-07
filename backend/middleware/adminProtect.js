const jwt = require('jsonwebtoken');

const adminProtect = (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // 1. Read token from header
            token = req.headers.authorization.split(' ')[1];

            // 2. Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 3. Extract userId and role
            req.admin = {
                id: decoded.id,
                role: decoded.role
            };

            // 4. Check if role is admin
            if (req.admin.role === 'admin') {
                // 5. Allow access
                next();
            } else {
                // 6. Role not admin
                res.status(403).json({ message: 'Forbidden: Admin role required' });
            }
        } catch (error) {
            console.error(error);
            // 6. Invalid token
            res.status(403).json({ message: 'Forbidden: Invalid token' });
        }
    } else {
        // 6. No token
        res.status(403).json({ message: 'Forbidden: No token provided' });
    }
};

module.exports = { adminProtect };
