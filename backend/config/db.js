const mysql = require('mysql2');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, './.env') });

const db = mysql.createPool({
    uri: process.env.DATABASE_URL, 
    ssl: { rejectUnauthorized: false },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = db;
