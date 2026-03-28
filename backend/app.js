const express=require('express')
const app=express()
const cors=require('cors')
const db=require('./config/db')
const jwt=require("jsonwebtoken")
const cookieparser=require('cookie-parser')
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, './config/.env') });


const allowedOrigins = [
    process.env.FRONTEND_URL,      // Your Netlify URL
    "http://localhost:5173",       // Your Local React URL
    "http://127.0.0.1:5173"        // Just in case
];

app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
}));

// app.use(cors({
//     // Fallback to localhost if the environment variable isn't set
//     origin: process.env.FRONTEND_URL || 'http://localhost:5173', 
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     // allowedHeaders: ["Content-Type", "Authorization"]
// }));
app.use(express.json())
app.use(cookieparser())

app.get('/verify', (req, res) => {
    const token = req.cookies.authToken; // Needs cookie-parser installed
    // console.log(token);
    
    if (!token) {
        console.log("-----------------------","no token");
        
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
app.get('/student-data', (req, res) => {
    const token = req.cookies.authToken;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get everything for the student using the ID from the token
    const sql = "SELECT full_name, role, email, contact, student_bus_id, course, branch_sem FROM users WHERE id = ?";
    
    db.query(sql, [decoded.username], (err, results) => {
        if (err) return res.status(500).json({ error: "DB Error" });
        res.json(results[0]); 
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
        password
    } = req.body;

    let sql = "";
    let values = [];

    // 1. Determine which table to use based on the role
        sql = `INSERT INTO students 
               (username,middlename,firstname,lastname,gender,email,phone,password) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        values = [username,middlename,firstname,lastname,gender,email,phone,password];
        

    // 2. Execute the query
    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Signup Error:", err.message);
            return res.status(500).json({ error: "Database error during signup" });
        }

        // 3. Generate JWT Token
        // result.insertId is the ID from whichever table was used
        const token = jwt.sign(
            { username:username, password:password }, 
            process.env.JWT_SECRET, 
            { expiresIn: "1d" }
        );

        // 4. Set the Cookie
        res.cookie('authToken', token, {
            httpOnly: true,
            secure: false, // Set to true in production with HTTPS
            sameSite: 'lax',
            maxAge: 86400000 
        });

        res.status(201).json({ 
            message: `${username} registered successfully!`,
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
        password
    } = req.body;

    let sql = "";
    let values = [];

    // 1. Determine which table to use based on the role
        sql = `INSERT INTO admins
               (username,middlename,firstname,lastname,gender,email,phone,password) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        values = [username,middlename,firstname,lastname,gender,email,phone,password];
        

    // 2. Execute the query
    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Signup Error:", err.message);
            return res.status(500).json({ error: "Database error during signup" });
        }

        // 3. Generate JWT Token
        // result.insertId is the ID from whichever table was used
        const token = jwt.sign(
            { username:username, password:password }, 
            process.env.JWT_SECRET, 
            { expiresIn: "1d" }
        );

        // 4. Set the Cookie
        res.cookie('authToken', token, {
            httpOnly: true,
            secure: false, // Set to true in production with HTTPS
            sameSite: 'lax',
            maxAge: 86400000 
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
        password
    } = req.body;

    let sql = "";
    let values = [];

    // 1. Determine which table to use based on the role
        sql = `INSERT INTO staff
               (username,middlename,firstname,lastname,gender,email,phone,password) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        values = [username,middlename,firstname,lastname,gender,email,phone,password];
        

    // 2. Execute the query
    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Signup Error:", err.message);
            return res.status(500).json({ error: "Database error during signup" });
        }

        // 3. Generate JWT Token
        // result.insertId is the ID from whichever table was used
        const token = jwt.sign(
            { username:username, password:password }, 
            process.env.JWT_SECRET, 
            { expiresIn: "1d" }
        );

        // 4. Set the Cookie
        res.cookie('authToken', token, {
            httpOnly: true,
            secure: false, // Set to true in production with HTTPS
            sameSite: 'lax',
            maxAge: 86400000 
        });

        res.status(201).json({ 
            message: `${username} registered successfully!`,
        });
    });
});

app.post('/login/student', (req, res) => {
    const { identifier, password} = req.body;

    // Build query based on role
    let sql = "";
    let params = [];

    sql = "SELECT * FROM students WHERE  username = ? AND password = ?;"
    params = [identifier, password];

    db.query(sql, params, (err, results) => {
        if (err){
            console.log(err)
            return res.status(500).json({ error: "Database error" });
        }

        console.log(results);
        
        if (results.length > 0) {
            const user = results[0];

            // Create Token
            const token = jwt.sign(
                { username:user, password:password },
                process.env.JWT_SECRET, 
                { expiresIn: "1m" } // Keeping your 1-minute test limit
            );

            // Set Cookie
            res.cookie('authToken', token, {
                httpOnly: true,
                secure: false, // Set true for HTTPS
                sameSite: 'lax',
                maxAge: 60000 // 1 minute
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
app.post('/login/admin', (req, res) => {
    const { identifier, password} = req.body;

    // Build query based on role
    let sql = "";
    let params = [];

    sql = "SELECT * FROM admins WHERE  username = ? AND password = ?;"
    params = [identifier, password];

    db.query(sql, params, (err, results) => {
        if (err){
            console.log(err)
            return res.status(500).json({ error: "Database error" });
        }

        console.log(results);
        
        if (results.length > 0) {
            const user = results[0];

            // Create Token
            const token = jwt.sign(
                { username:user, password:password },
                process.env.JWT_SECRET, 
                { expiresIn: "1m" } // Keeping your 1-minute test limit
            );

            // Set Cookie
            res.cookie('authToken', token, {
                httpOnly: true,
                secure: false, // Set true for HTTPS
                sameSite: 'lax',
                maxAge: 60000 // 1 minute
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
    const { identifier, password} = req.body;
    console.log(identifier,password);
    
    // Build query based on role
    let sql = "";
    let params = [];

    sql = "SELECT * FROM staff WHERE  username = ? AND password = ?;"
    params = [identifier, password];

    db.query(sql, params, (err, results) => {
        if (err){
            console.log(err)
            return res.status(500).json({ error: "Database error" });
        }

        console.log(results);
        
        if (results.length > 0) {
            const user = results[0];

            // Create Token
            const token = jwt.sign(
                { username:user, password:password },
                process.env.JWT_SECRET, 
                { expiresIn: "1m" } // Keeping your 1-minute test limit
            );

            // Set Cookie
            res.cookie('authToken', token, {
                httpOnly: true,
                secure: false, // Set true for HTTPS
                sameSite: 'lax',
                maxAge: 60000 // 1 minute
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