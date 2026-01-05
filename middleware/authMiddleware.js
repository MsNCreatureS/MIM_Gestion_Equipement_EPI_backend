const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
    // Get token from header: Authorization: Bearer <token>
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Accès refusé. Token manquant.' });
    }

    try {
        // Use the same secret key as in authController
        const decoded = jwt.verify(token, 'secret_key_mim_gestion_epi_backend_2026');
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Token invalide ou expiré.' });
    }
};

exports.verifyAdmin = (req, res, next) => {
    if (!req.user || (req.user.role !== 'ADMIN' && req.user.role !== 'Admin')) {
        return res.status(403).json({ message: 'Accès réservé aux administrateurs.' });
    }
    next();
};
