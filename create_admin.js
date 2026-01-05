const { authDB } = require('./config/db');
const bcrypt = require('bcrypt');

async function createAdmin() {
    try {
        const password = 'secret';
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        console.log('Generated hash:', hashedPassword);

        const [result] = await authDB.execute(
            'INSERT INTO utilisateurs (Nom, Prenom, Email, MotDePasseHashe, Role, DateCreation) VALUES (?, ?, ?, ?, ?, NOW())',
            ['Dev', 'Admin', 'dev_admin@test.com', hashedPassword, 'ADMIN']
        );

        console.log('User created with ID:', result.insertId);
        console.log('Login with: dev_admin@test.com / secret');
        process.exit(0);
    } catch (error) {
        console.error('Error creating user:', error);
        process.exit(1);
    }
}

createAdmin();
