const mysql = require('mysql2');

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, './.env') });

const db = mysql.createConnection({
    uri: process.env.DATABASE_URL, 
    ssl: { rejectUnauthorized: false }
});

module.exports = db;
