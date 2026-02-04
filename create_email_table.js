require('dotenv').config();
const { appDB } = require('./config/db');

async function createTable() {
    try {
        await appDB.execute(`
            CREATE TABLE IF NOT EXISTS email_recipients (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) NOT NULL UNIQUE,
                name VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Table email_recipients created successfully.');

        // Add default recipient if table is empty
        const [rows] = await appDB.execute('SELECT * FROM email_recipients');
        if (rows.length === 0) {
            await appDB.execute('INSERT INTO email_recipients (email, name) VALUES (?, ?)', ['erwan.gimenez@foselev.fr', 'Erwan Gimenez']);
            console.log('Default recipient added.');
        }
    } catch (error) {
        console.error('Error creating table:', error);
    }
    process.exit();
}

createTable();
