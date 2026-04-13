const jwt = require("jsonwebtoken");
const db = require('../config/db');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_PORT == 465, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

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

    // Check if email is verified
    db.query("SELECT is_verified FROM otp_verifications WHERE email = ?", [email], (vErr, vResults) => {
        if (vErr || vResults.length === 0 || !vResults[0].is_verified) {
            return res.status(400).json({ error: "Email not verified. Please verify your email via OTP." });
        }

        const sql = `INSERT INTO students (username, middlename, firstname, lastname, gender, email, phone, password, role, fathername, fatherphone, course) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const values = [username, middlename, firstname, lastname, gender, email, phone, password, role, fathername, fatherphone, course];

        db.query(sql, values, (err, result) => {
            if (err) {
                console.error("Signup Error:", err.message);
                if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: "Username or Email already exists" });
                return res.status(500).json({ error: "Database error during signup" });
            }
            
            // Cleanup OTP record after successful registration
            db.query("DELETE FROM otp_verifications WHERE email = ?", [email]);

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
    });
};

exports.registerAdmin = (req, res) => {
    const { username, middlename, firstname, lastname, gender, email, phone, password, profile_pic, role="admin" } = req.body;

    // Check if email is verified
    db.query("SELECT is_verified FROM otp_verifications WHERE email = ?", [email], (vErr, vResults) => {
        if (vErr || vResults.length === 0 || !vResults[0].is_verified) {
            return res.status(400).json({ error: "Email not verified. Please verify your email via OTP." });
        }

        const sql = `INSERT INTO admins (username, middlename, firstname, lastname, gender, email, phone, password, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const values = [username, middlename, firstname, lastname, gender, email, phone, password, role];

        db.query(sql, values, (err, result) => {
            if (err) {
                console.error("Signup Error:", err.message);
                return res.status(500).json({ error: "Database error during signup" });
            }

            // Cleanup OTP record after successful registration
            db.query("DELETE FROM otp_verifications WHERE email = ?", [email]);

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
    });
};

exports.registerStaff = (req, res) => {
    const { username, middlename, firstname, lastname, gender, email, phone, password, profile_pic, work_type, role="staff" } = req.body;

    // Check if email is verified
    db.query("SELECT is_verified FROM otp_verifications WHERE email = ?", [email], (vErr, vResults) => {
        if (vErr || vResults.length === 0 || !vResults[0].is_verified) {
            return res.status(400).json({ error: "Email not verified. Please verify your email via OTP." });
        }

        const sql = `INSERT INTO staff (username, middlename, firstname, lastname, gender, email, phone, password, role, work_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const values = [username, middlename, firstname, lastname, gender, email, phone, password, role, work_type];

        db.query(sql, values, (err, result) => {
            if (err) {
                console.error("Signup Error:", err.message);
                return res.status(500).json({ error: "Database error during signup" });
            }

            // Cleanup OTP record after successful registration
            db.query("DELETE FROM otp_verifications WHERE email = ?", [email]);

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
    });
};

exports.loginStudent = (req, res) => {
    const { username, password } = req.body;
    const sql = "SELECT * FROM students WHERE username = ? AND password = ?;";
    db.query(sql, [username, password], (err, results) => {
        if (err) { console.log(err); return res.status(500).json({ error: "Database error" }); }
        if (results.length > 0) {
            const token = jwt.sign({ username, password, role: "student" }, process.env.JWT_SECRET, { expiresIn: "1d" });
            const isProduction = process.env.NODE_ENV === 'production';
            res.cookie('authToken', token, { httpOnly: true, secure: isProduction, sameSite: isProduction ? 'none' : 'lax', maxAge: 86400000 });
            return res.status(200).json({ message: "Login successful", role: "student" });
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
            const token = jwt.sign({ username, password, role: "admin" }, process.env.JWT_SECRET, { expiresIn: "1d" });
            const isProduction = process.env.NODE_ENV === 'production';
            res.cookie('authToken', token, { httpOnly: true, secure: isProduction, sameSite: isProduction ? 'none' : 'lax', maxAge: 86400000 });
            return res.status(200).json({ message: "Login successful", role: "admin" });
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

exports.sendOtp = async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const saveOtpToDb = (email, otp) => {
        const sql = `INSERT INTO otp_verifications (email, otp, is_verified) VALUES (?, ?, FALSE) 
                     ON DUPLICATE KEY UPDATE otp = VALUES(otp), is_verified = FALSE, created_at = CURRENT_TIMESTAMP`;
        db.query(sql, [email, otp], (dbErr) => {
            if (dbErr) return res.status(500).json({ error: "Database error" });
            res.json({ success: true, message: "OTP sent successfully!" });
        });
    };

    if (process.env.NODE_ENV === 'production') {
        try {
            const response = await fetch('https://api.brevo.com/v3/smtp/email', {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'api-key': process.env.BREVO_API_KEY,
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    sender: { email: process.env.EMAIL_USER, name: 'Hostel Management' },
                    to: [{ email }],
                    subject: 'Your Verification Code',
                    textContent: `Your OTP for registration is: ${otp}. It will expire in 10 minutes.`
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Brevo Error:", errorData);
                return res.status(500).json({ error: "Failed to send email via Brevo" });
            }

            saveOtpToDb(email, otp);
        } catch (error) {
            console.error("Brevo API Connection Error:", error);
            return res.status(500).json({ error: "Failed to connect to email service" });
        }
    } else {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your Verification Code',
            text: `Your OTP for registration is: ${otp}. It will expire in 10 minutes.`
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.error("Email Error:", err);
                return res.status(500).json({ error: "Failed to send email" });
            }
            saveOtpToDb(email, otp);
        });
    }
};

exports.verifyOtp = (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ error: "Email and OTP are required" });

    // Check if OTP matches and is not older than 10 minutes
    const sql = `SELECT * FROM otp_verifications WHERE email = ? AND otp = ? AND created_at > (NOW() - INTERVAL 10 MINUTE)`;
    db.query(sql, [email, otp], (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
        if (results.length === 0) return res.status(400).json({ error: "Invalid or expired OTP" });

        db.query("UPDATE otp_verifications SET is_verified = TRUE WHERE email = ?", [email], (updErr) => {
            if (updErr) return res.status(500).json({ error: "Database error" });
            res.json({ success: true, message: "Email verified successfully!" });
        });
    });
};
