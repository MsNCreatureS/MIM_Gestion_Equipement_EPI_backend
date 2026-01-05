const mysql = require('mysql2/promise');

// Connection processing queue for Auth DB (logicielmim)
const authDB = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'logicielmim',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Connection processing queue for App DB (mim_feedback)
// Note: Database might not create yet, so we connect to MySQL generally first or handle it in init
const appDB = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'mim_feedback',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = { authDB, appDB };
