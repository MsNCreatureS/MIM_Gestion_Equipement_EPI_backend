const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { authDB } = require('../config/db');
const crypto = require('crypto');

// Helper function to verify password with multiple algorithms
async function verifyPassword(password, storedHash) {
    // Check if it's a bcrypt hash (starts with $2a$ or $2b$)
    if (storedHash.startsWith('$2a$') || storedHash.startsWith('$2b$')) {
        return bcrypt.compare(password, storedHash);
    }

    // Otherwise, try SHA256 + Hex (C# app format)
    const sha256Hash = crypto.createHash('sha256').update(password).digest('hex');
    // Also try case-insensitive comparison just in case C# used upper/lower
    return sha256Hash.toLowerCase() === storedHash.toLowerCase();
}

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log(`Login attempt for: ${email}`);

        // Find user by email in logicielmim.utilisateurs
        const [rows] = await authDB.execute(
            'SELECT * FROM Utilisateurs WHERE Email = ?',
            [email]
        );

        if (rows.length === 0) {
            console.log('User not found');
            return res.status(401).json({ message: 'Identifiants invalides' });
        }

        const user = rows[0];

        // Verify password using hybrid check
        const validPassword = await verifyPassword(password, user.MotDePasseHashe);

        if (!validPassword) {
            console.log('Invalid password');
            return res.status(401).json({ message: 'Identifiants invalides' });
        }

        // Verify Role (Admin only)
        if (user.Role !== 'ADMIN' && user.Role !== 'Admin') {
            // Check case sensitivity or specific role string from SQL dump. 
            // SQL dump doesn't show data for Role, but schema says varchar(20).
            // User request says "seul le sutilistauer avec le role ADMIN peuvent se connecter".
            console.log(`Role denied: ${user.Role}`);
            return res.status(403).json({ message: 'Accès réservé aux administrateurs' });
        }

        // Generate Token
        // Secret should be in .env but user asked to avoid .env. Hardcoding specific secret for now.
        const token = jwt.sign(
            { id: user.IdUtilisateur, role: user.Role, email: user.Email },
            'secret_key_mim_gestion_epi_backend_2026',
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user.IdUtilisateur,
                nom: user.Nom,
                prenom: user.Prenom,
                email: user.Email,
                role: user.Role
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Erreur serveur lors de la connexion' });
    }
};
