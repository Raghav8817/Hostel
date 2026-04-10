const db = require('../config/db');

const createTableSql = `
    CREATE TABLE IF NOT EXISTS otp_verifications (
        email VARCHAR(255) PRIMARY KEY,
        otp VARCHAR(6) NOT NULL,
        is_verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
`;

db.query(createTableSql, (err) => {
    if (err) {
        console.error('Error creating otp_verifications table:', err);
        process.exit(1);
    }
    console.log('Table otp_verifications created or already exists.');
    db.end();
});
