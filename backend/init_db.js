const fs = require('fs');
const path = require('path');
const mysql = require('mysql2');
require('dotenv').config({ path: path.resolve(__dirname, './config/.env') });

console.log("Connecting to database using DATABASE_URL...");

if (!process.env.DATABASE_URL) {
    console.error("ERROR: DATABASE_URL is not set in backend/config/.env!");
    process.exit(1);
}

const db = mysql.createConnection({
    uri: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    multipleStatements: true
});

db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err.message);
        process.exit(1);
    }
    console.log("Connected to MySQL database successfully.");

    const schemaPath = path.join(__dirname, 'schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf8');

    console.log("Executing schema SQL scripts to setup tables and seed data...");
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error setting up database tables:", err);
            process.exit(1);
        }
        console.log("Database initialized successfully with all required tables and seed data!");
        db.end();
    });
});
