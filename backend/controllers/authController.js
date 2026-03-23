const jwt = require('jsonwebtoken');
const db = require('../config/db');

function getRoleTables(role) {
    if (role === 'admin') return { main: 'admins', logs: 'adminlogs', idField: 'admin_id' };
    if (role === 'staff') return { main: 'staff', logs: 'stafflogs', idField: 'staff_id' };
    if (role === 'student') return { main: 'students', logs: 'studentlogs', idField: 'student_id' };
    return null;
}

exports.register = (req, res) => {
    const { role } = req.params;
    const tables = getRoleTables(role);
    if (!tables) return res.status(400).json({ error: "Invalid role specified." });

    const { username, firstname, middlename, lastname, gender, email, phone, password } = req.body;
    
    // Dynamically insert into the exact assigned role table!
    const sql = `INSERT INTO ${tables.main} (username, firstname, middlename, lastname, gender, email, phone, password_hash) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const loginquery = `INSERT INTO ${tables.logs} (${tables.idField}, authtoken) VALUES (?, ?) ON DUPLICATE KEY UPDATE authtoken = VALUES(authtoken)`;
    
    db.query(sql, [username, firstname, middlename, lastname, gender, email, phone, password], (err, result) => {
        if (err) {
            console.error("Database Error:", err);
            if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: "An account with this email/username already exists." });
            return res.status(500).json({ error: "An internal server error occurred." });
        }
        
        // Embed the user's role cryptographically inside the JWT token!
        const token = jwt.sign({ username, role }, process.env.JWT_SECRET, { expiresIn: '1m' });
        
        db.query(loginquery, [username, token], (logErr) => {
            if (logErr) console.error("Error inserting into logs", logErr);
        });
        
        res.cookie('authToken', token).json({ message: "Registered successfully!", id: result.insertId });
    });
};

exports.login = (req, res) => {
    const { role } = req.params;
    const tables = getRoleTables(role);
    if (!tables) return res.status(400).json({ error: "Invalid role specified." });

    const { identifier, password } = req.body;
    const sql = `SELECT * FROM ${tables.main} WHERE (username=? OR email=? OR phone=?) AND password_hash=?`;
    
    db.query(sql, [identifier, identifier, identifier, password], (err, result) => {
        if (err) return res.status(500).json({ error: "An internal server error occurred." });
        if (result.length === 0) return res.status(401).json({ error: "Invalid credentials." });
        
        const username = result[0].username;
        const token = jwt.sign({ username, role }, process.env.JWT_SECRET, { expiresIn: '1m' });
        
        const loginquery = `INSERT INTO ${tables.logs} (${tables.idField}, authtoken) VALUES (?, ?) ON DUPLICATE KEY UPDATE authtoken = VALUES(authtoken)`;
        db.query(loginquery, [username, token], (logErr) => {
            if (logErr) console.error("Failed to insert log into DB:", logErr);
            res.cookie('authToken', token).json({ message: "Login successful!", id: result[0].id });
        });
    });
};

exports.verifyToken = (req, res) => {
    const token = req.cookies.authToken || req.body.token; 
    if (!token) return res.status(401).json({ valid: false });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { username, role } = decoded;
        const tables = getRoleTables(role);
        
        if (!tables) return res.status(401).json({ valid: false });

        const sql = `SELECT authtoken FROM ${tables.logs} WHERE ${tables.idField} = ?`;
        db.query(sql, [username], (err, result) => {
            if (err || result.length === 0) return res.status(401).json({ valid: false });
            
            const dbToken = result[0].authtoken;
            if (dbToken === token) return res.json({ valid: true });
            else return res.status(401).json({ valid: false });
        });
    } catch (verifyErr) {
        return res.status(401).json({ valid: false });
    }
};

exports.logout = (req, res) => {
    const token = req.cookies.authToken;
    
    if (token) {
        const decoded = jwt.decode(token);
        if (decoded && decoded.role) {
            const tables = getRoleTables(decoded.role);
            if (tables) {
                const sql = `DELETE FROM ${tables.logs} WHERE authtoken = ?`;
                db.query(sql, [token], (err) => {
                    if (err) console.error("Error deleting session:", err);
                });
            }
        }
    }

    res.clearCookie('authToken');
    res.json({ message: "Logged out successfully" });
};
