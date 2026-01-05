const mysql = require('mysql2/promise');
const { appDB } = require('./config/db');

async function checkColumns() {
    try {
        const [rows] = await appDB.execute('SHOW COLUMNS FROM remontees');
        console.log('Columns in remontees table:');
        rows.forEach(row => {
            console.log(`- ${row.Field} (${row.Type})`);
        });
        process.exit(0);
    } catch (error) {
        console.error('Error checking columns:', error);
        process.exit(1);
    }
}

checkColumns();
