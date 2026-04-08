const jwt = require("jsonwebtoken");
const db = require('../config/db');

exports.verifyToken = (req, res) => {
    const token = req.cookies.authToken;
    if (!token) return res.status(401).json({ authenticated: false });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.status(200).json({ authenticated: true, role: decoded.role, user: decoded });
    } catch (err) {
        res.status(401).json({ authenticated: false });
    }
};

exports.logout = (req, res) => {
    const isProduction = process.env.NODE_ENV === 'production';
    res.clearCookie('authToken', { httpOnly: true, secure: isProduction, sameSite: isProduction ? 'none' : 'lax', path: '/' });
    res.status(200).json({ success: true, message: "Logged out successfully. See you soon!" });
};

exports.registerStudent = (req, res) => {
    const { username, middlename, firstname, lastname, gender, email, phone, password, fathername, fatherphone, course, profile_pic, role="student" } = req.body;
    const sql = `INSERT INTO students (username, middlename, firstname, lastname, gender, email, phone, password, role, fathername, fatherphone, course) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [username, middlename, firstname, lastname, gender, email, phone, password, role, fathername, fatherphone, course];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Signup Error:", err.message);
            if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: "Username or Email already exists" });
            return res.status(500).json({ error: "Database error during signup" });
        }
        const token = jwt.sign({ username, password, role }, process.env.JWT_SECRET, { expiresIn: "1d" });
        const isProduction = process.env.NODE_ENV === 'production';
        res.cookie('authToken', token, { httpOnly: true, secure: isProduction, sameSite: isProduction ? 'none' : 'lax', maxAge: 86400000 });
        
        if (profile_pic) {
            db.query(`CREATE TABLE IF NOT EXISTS students_profile_pic (username VARCHAR(255) PRIMARY KEY, profile_pic LONGTEXT)`, (err) => {
                if (!err) {
                    db.query(`INSERT INTO students_profile_pic (username, profile_pic) VALUES (?, ?) ON DUPLICATE KEY UPDATE profile_pic = VALUES(profile_pic)`, [username, profile_pic], (imgErr) => {
                        if (imgErr) console.error("Student Pic Save Error:", imgErr);
                    });
                }
            });
        }

        res.status(201).json({ message: `${username} registered successfully!`, authenticated: true });
    });
};

exports.registerAdmin = (req, res) => {
    const { username, middlename, firstname, lastname, gender, email, phone, password, profile_pic, role="admin" } = req.body;
    // Fix: Fixed typo in original sql query '?, ?' instead of '? .?'
    const sql = `INSERT INTO admins (username, middlename, firstname, lastname, gender, email, phone, password, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [username, middlename, firstname, lastname, gender, email, phone, password, role];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Signup Error:", err.message);
            return res.status(500).json({ error: "Database error during signup" });
        }
        const token = jwt.sign({ username, password, role }, process.env.JWT_SECRET, { expiresIn: "1d" });
        const isProduction = process.env.NODE_ENV === 'production';
        res.cookie('authToken', token, { httpOnly: true, secure: isProduction, sameSite: isProduction ? 'none' : 'lax', maxAge: 86400000 });
        
        if (profile_pic) {
            db.query(`CREATE TABLE IF NOT EXISTS admin_profile_pics (admin_username VARCHAR(255) PRIMARY KEY, image_data LONGTEXT)`, (err) => {
                if (!err) {
                    db.query(`INSERT INTO admin_profile_pics (admin_username, image_data) VALUES (?, ?) ON DUPLICATE KEY UPDATE image_data = VALUES(image_data)`, [username, profile_pic], (imgErr) => {
                        if (imgErr) console.error("Admin Pic Save Error:", imgErr);
                    });
                }
            });
        }

        res.status(201).json({ message: `${username} registered successfully!` });
    });
};

exports.registerStaff = (req, res) => {
    const { username, middlename, firstname, lastname, gender, email, phone, password, profile_pic, role="staff" } = req.body;
    const sql = `INSERT INTO staff (username, middlename, firstname, lastname, gender, email, phone, password, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [username, middlename, firstname, lastname, gender, email, phone, password, role];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Signup Error:", err.message);
            return res.status(500).json({ error: "Database error during signup" });
        }
        const token = jwt.sign({ username, password, role }, process.env.JWT_SECRET, { expiresIn: "1d" });
        const isProduction = process.env.NODE_ENV === 'production';
        res.cookie('authToken', token, { httpOnly: true, secure: isProduction, sameSite: isProduction ? 'none' : 'lax', maxAge: 86400000 });
        
        if (profile_pic) {
            db.query(`CREATE TABLE IF NOT EXISTS staff_profile_pics (staff_username VARCHAR(255) PRIMARY KEY, image_data LONGTEXT)`, (err) => {
                if (!err) {
                    db.query(`INSERT INTO staff_profile_pics (staff_username, image_data) VALUES (?, ?) ON DUPLICATE KEY UPDATE image_data = VALUES(image_data)`, [username, profile_pic], (imgErr) => {
                        if (imgErr) console.error("Staff Pic Save Error:", imgErr);
                    });
                }
            });
        }

        res.status(201).json({ message: `${username} registered successfully!` });
    });
};

exports.loginStudent = (req, res) => {
    const { username, password } = req.body;
    const sql = "SELECT * FROM students WHERE username = ? AND password = ?;";
    db.query(sql, [username, password], (err, results) => {
        if (err) { console.log(err); return res.status(500).json({ error: "Database error" }); }
        if (results.length > 0) {
            const token = jwt.sign({ username, password, role: "students" }, process.env.JWT_SECRET, { expiresIn: "1d" });
            const isProduction = process.env.NODE_ENV === 'production';
            res.cookie('authToken', token, { httpOnly: true, secure: isProduction, sameSite: isProduction ? 'none' : 'lax', maxAge: 86400000 });
            return res.status(200).json({ message: "Login successful", role: "students" });
        } else return res.status(401).json({ error: "Invalid credentials ❌" });
    });
};

exports.loginAdmin = (req, res) => {
    const { username, password } = req.body;
    const sql = "SELECT * FROM admins WHERE username = ? AND password = ?;";
    db.query(sql, [username, password], (err, results) => {
        if (err) { console.log(err); return res.status(500).json({ error: "Database error" }); }
        if (results.length > 0) {
            const user = results[0];
            const token = jwt.sign({ username, password, role: "admins" }, process.env.JWT_SECRET, { expiresIn: "1d" });
            const isProduction = process.env.NODE_ENV === 'production';
            res.cookie('authToken', token, { httpOnly: true, secure: isProduction, sameSite: isProduction ? 'none' : 'lax', maxAge: 86400000 });
            return res.status(200).json({ message: "Login successful", role: user.role });
        } else return res.status(401).json({ error: "Invalid credentials ❌" });
    });
};

exports.loginStaff = (req, res) => {
    const { username, password } = req.body;
    const sql = "SELECT * FROM staff WHERE username = ? AND password = ?;";
    db.query(sql, [username, password], (err, results) => {
        if (err) { console.log(err); return res.status(500).json({ error: "Database error" }); }
        if (results.length > 0) {
            const user = results[0];
            const token = jwt.sign({ username, password, role: user.role || "staff" }, process.env.JWT_SECRET, { expiresIn: "1d" });
            const isProduction = process.env.NODE_ENV === 'production';
            res.cookie('authToken', token, { httpOnly: true, secure: isProduction, sameSite: isProduction ? 'none' : 'lax', maxAge: 86400000 });
            return res.status(200).json({ message: "Login successful", role: user.role || "staff" });
        } else return res.status(401).json({ error: "Invalid credentials ❌" });
    });
};
