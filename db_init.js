const mysql = require('mysql2/promise');

async function initDB() {
    const connection = await mysql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: 'root'
    });

    try {
        // Create Database
        await connection.query(`CREATE DATABASE IF NOT EXISTS MIM_Feedback`);
        console.log('Database MIM_Feedback created or already exists.');

        // Switch to the database
        await connection.changeUser({ database: 'MIM_Feedback' });

        // Create Table
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS remontees (
                id INT AUTO_INCREMENT PRIMARY KEY,
                societe_agence VARCHAR(255) NOT NULL,
                date DATE NOT NULL,
                nom_prenom VARCHAR(255) NOT NULL,
                lieu_client VARCHAR(255) NOT NULL,
                type_probleme VARCHAR(255) NOT NULL,
                description TEXT NOT NULL,
                action TEXT NOT NULL,
                status VARCHAR(50) DEFAULT 'En attente',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `;
        await connection.query(createTableQuery);
        console.log('Table remontees created or already exists.');

    } catch (error) {
        console.error('Error initializing database:', error);
    } finally {
        await connection.end();
    }
}

initDB();
