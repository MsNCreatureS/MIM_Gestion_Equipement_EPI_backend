const { authDB } = require('./config/db');

async function checkUsers() {
    try {
        const [rows] = await authDB.execute('SELECT IdUtilisateur, Nom, Prenom, Email, Role, MotDePasseHashe FROM utilisateurs');
        console.log('Users in utilisateurs table:');
        rows.forEach(user => {
            console.log(`- ID: ${user.IdUtilisateur}, Name: ${user.Nom} ${user.Prenom}, Email: ${user.Email}, Role: ${user.Role}`);
            console.log(`  Hash: ${user.MotDePasseHashe.substring(0, 20)}...`);
        });
        if (rows.length === 0) {
            console.log('No users found.');
        }
        process.exit(0);
    } catch (error) {
        console.error('Error checking users:', error);
        process.exit(1);
    }
}

checkUsers();
