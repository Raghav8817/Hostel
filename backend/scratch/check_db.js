const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

// Fix path to look in backend/config/.env relative to this script
dotenv.config({ path: path.join(__dirname, '../config/.env') });

async function check() {
    console.log("Connecting to:", process.env.DATABASE_URL);
    try {
        const db = await mysql.createConnection({
            uri: process.env.DATABASE_URL,
            ssl: { rejectUnauthorized: false }
        });

        const [tables] = await db.query("SHOW TABLES");
        console.log("--- Tables in Database ---");
        console.table(tables.map(t => Object.values(t)[0]));

        db.end();
    } catch (err) {
        console.error("Critical DB Error:", err.message);
    }
}

check();
