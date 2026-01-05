const { authDB } = require('./config/db');
const bcrypt = require('bcrypt');

async function resetPasswords() {
    try {
        const password = 'secret';
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const usersToReset = [
            'tiphaine.gimenez@foselev.fr',
            'erwan.gimenez@foselev.fr'
        ];

        console.log(`Resetting passwords to '${password}' for: ${usersToReset.join(', ')}`);

        for (const email of usersToReset) {
            const [result] = await authDB.execute(
                'UPDATE utilisateurs SET MotDePasseHashe = ? WHERE Email = ?',
                [hashedPassword, email]
            );
            if (result.affectedRows > 0) {
                console.log(`✅ Password updated for ${email}`);
            } else {
                console.log(`⚠️ User not found: ${email}`);
            }
        }

        process.exit(0);
    } catch (error) {
        console.error('Error resetting passwords:', error);
        process.exit(1);
    }
}

resetPasswords();
