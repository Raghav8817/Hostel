const express = require('express')
const app = express()
const cors = require('cors')
const db = require('./config/db')
const jwt = require("jsonwebtoken")
const cookieparser = require('cookie-parser')
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, './config/.env') });


const allowedOrigins = [
    "http://localhost:5173",           // Your local React app
    "https://velvety-scone-4a9a17.netlify.app"    // Your deployed Netlify app
];

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"]
}));

app.use(express.json())
app.use(cookieparser())

app.get('/verify', (req, res) => {
    const token = req.cookies.authToken; // Needs cookie-parser installed
    // console.log(token);

    if (!token) {
        console.log("-----------------------", "no token");

        return res.status(401).json({ authenticated: false });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.status(200).json({ authenticated: true, user: decoded });
    } catch (err) {
        res.status(401).json({ authenticated: false });
    }
});

// Inside your backend app.js
app.get('/user-data', (req, res) => {
    const token = req.cookies.authToken;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ error: "Invalid Token" });
        console.log("decoded",decoded);
        
        // decoded contains { username, password, role } 
        // We use decoded.role (the table name) to run the query
        console.log("decoded.role",decoded.role);
        
        const tableName = decoded.role;
        const sql = `SELECT firstname, lastname, username FROM ${tableName} WHERE username = ?`;

        db.query(sql, [decoded.username], (err, result) => {
            if (err || result.length === 0) return res.status(404).json({ error: "User not found" });

            res.json(result[0]); // Sends back { firstname, lastname, username }
        });
    });
});

app.post('/register/student', (req, res) => {
    const {
        username,
        middlename,
        firstname,
        lastname,
        gender,
        email,
        phone,
        password,
        role="student"
    } = req.body;

    const sql = `INSERT INTO students 
                 (username, middlename, firstname, lastname, gender, email, phone, password,role) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)`;

    const values = [username, middlename, firstname, lastname, gender, email, phone, password,role];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Signup Error:", err.message);
            // Handle duplicate username/email
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ error: "Username or Email already exists" });
            }
            return res.status(500).json({ error: "Database error during signup" });
        }

        // 1. Generate JWT Token 
        // CRITICAL: Removed password from the payload.
        // Even without bcrypt, NEVER put passwords in a JWT. 
        // JWTs are encoded, not encrypted; anyone can read them.
        const token = jwt.sign(
            {  username: username, password:password, role: role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        // 2. Set the Cookie (Corrected for Render/Netlify Deployment)
        const isProduction = process.env.NODE_ENV === 'production';

        res.cookie('authToken', token, {
            httpOnly: true,
            secure: isProduction, // true on Render, false on Localhost
            sameSite: isProduction ? 'none' : 'lax',
            maxAge: 60000
        });

        res.status(201).json({
            message: `${username} registered successfully!`,
            authenticated: true
        });
    });
});
app.post('/register/admin', (req, res) => {
    const {
        username,
        middlename,
        firstname,
        lastname,
        gender,
        email,
        phone,
        password,
        role="admin"
    } = req.body;

    let sql = "";
    let values = [];

    // 1. Determine which table to use based on the role
    sql = `INSERT INTO admins
               (username,middlename,firstname,lastname,gender,email,phone,password,role) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?.?)`;
    values = [username, middlename, firstname, lastname, gender, email, phone, password,role];


    // 2. Execute the query
    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Signup Error:", err.message);
            return res.status(500).json({ error: "Database error during signup" });
        }

        // 3. Generate JWT Token
        // result.insertId is the ID from whichever table was used
        const token = jwt.sign(
            { username: username, password: password,role:role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        // 4. Set the Cookie
        const isProduction = process.env.NODE_ENV === 'production';

        res.cookie('authToken', token, {
            httpOnly: true,
            secure: isProduction, // true on Render, false on Localhost
            sameSite: isProduction ? 'none' : 'lax',
            maxAge: 60000
        });

        res.status(201).json({
            message: `${username} registered successfully!`,
        });
    });
});
app.post('/register/staff', (req, res) => {
    const {
        username,
        middlename,
        firstname,
        lastname,
        gender,
        email,
        phone,
        password,
        role="staff"
    } = req.body;

    let sql = "";
    let values = [];

    // 1. Determine which table to use based on the role
    sql = `INSERT INTO staff
               (username,middlename,firstname,lastname,gender,email,phone,password,role) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)`;
    values = [username, middlename, firstname, lastname, gender, email, phone, password,role];


    // 2. Execute the query
    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Signup Error:", err.message);
            return res.status(500).json({ error: "Database error during signup" });
        }

        // 3. Generate JWT Token
        // result.insertId is the ID from whichever table was used
        const token = jwt.sign(
            { username: username, password: password,role:role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        // 4. Set the Cookie
        const isProduction = process.env.NODE_ENV === 'production';

        res.cookie('authToken', token, {
            httpOnly: true,
            secure: isProduction, // true on Render, false on Localhost
            sameSite: isProduction ? 'none' : 'lax',
            maxAge: 60000
        });

        res.status(201).json({
            message: `${username} registered successfully!`,
        });
    });
});

app.post('/login/student', (req, res) => {
    const { username, password } = req.body;

    // Build query based on role
    let sql = "";
    let params = [];

    sql = "SELECT * FROM students WHERE  username = ? AND password = ?;"
    params = [username, password];

    db.query(sql, params, (err, results) => {
        if (err) {
            console.log(err)
            return res.status(500).json({ error: "Database error" });
        }
        console.log(results);

        if (results.length > 0) {

            // Create Token
            const token = jwt.sign(
                { username: username, password: password ,role:"students"},
                process.env.JWT_SECRET,
                { expiresIn: "1m" } // Keeping your 1-minute test limit
            );

            // Set Cookie
            const isProduction = process.env.NODE_ENV === 'production';

            res.cookie('authToken', token, {
                httpOnly: true,
                secure: isProduction, // true on Render, false on Localhost
                sameSite: isProduction ? 'none' : 'lax',
                maxAge: 60000
            });

            return res.status(200).json({
                message: "Login successful",
                role: "students"
            });
        } else {
            return res.status(401).json({ error: "Invalid credentials ❌" });
        }
    });
});
app.post('/login/admin', (req, res) => {
    const { username, password } = req.body;

    // Build query based on role
    let sql = "";
    let params = [];

    sql = "SELECT * FROM admins WHERE  username = ? AND password = ?;"
    params = [username, password];

    db.query(sql, params, (err, results) => {
        if (err) {
            console.log(err)
            return res.status(500).json({ error: "Database error" });
        }

        console.log(results);

        if (results.length > 0) {
            const user = results[0];

            // Create Token
            console.log("logged in admins");
            
            const token = jwt.sign(
                { username: username, password: password ,role:"admins"},
                process.env.JWT_SECRET,
                { expiresIn: "1m" } // Keeping your 1-minute test limit
            );

            // Set Cookie
            const isProduction = process.env.NODE_ENV === 'production';
            console.log("isproduction ",isProduction);
            
            res.cookie('authToken', token, {
                httpOnly: true,
                secure: isProduction, // true on Render, false on Localhost
                sameSite: isProduction ? 'none' : 'lax',
                maxAge: 60000
            });

            return res.status(200).json({
                message: "Login successful",
                role: user.role
            });
        } else {
            return res.status(401).json({ error: "Invalid credentials ❌" });
        }
    });
});

app.post('/login/staff', (req, res) => {
    const { username, password } = req.body;
    console.log(username, password);

    // Build query based on role
    let sql = "";
    let params = [];

    sql = "SELECT * FROM staff WHERE  username = ? AND password = ?;"
    params = [username, password];

    db.query(sql, params, (err, results) => {
        if (err) {
            console.log(err)
            return res.status(500).json({ error: "Database error" });
        }

        console.log(results);

        if (results.length > 0) {
            const user = results[0];

            // Create Token
            const token = jwt.sign(
                { username: user, password: password },
                process.env.JWT_SECRET,
                { expiresIn: "1m" } // Keeping your 1-minute test limit
            );

            // Set Cookie
            const isProduction = process.env.NODE_ENV === 'production';
            res.cookie('authToken', token, {
                httpOnly: true,
                secure: isProduction, // true on Render, false on Localhost
                sameSite: isProduction ? 'none' : 'lax',
                maxAge: 60000
            });

            return res.status(200).json({
                message: "Login successful",
                role: user.role
            });
        } else {
            return res.status(401).json({ error: "Invalid credentials ❌" });
        }
    });
});

app.listen(3000)