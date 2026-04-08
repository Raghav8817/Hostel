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
    "https://hostel-virid.vercel.app"    // Your deployed Netlify app
];

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"]
}));
//swift , itos,aura,
// Replace your old app.use(express.json()) with this:
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieparser())

// --- MIDDLEWARE TO VERIFY ADMIN TOKEN ---
const verifyAdmin = (req, res, next) => {
    const token = req.cookies.authToken;
    if (!token) return res.status(401).json({ message: "No token" });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ message: "Invalid token" });
        req.user = decoded; // This makes req.user.username available
        next();
    });
};

app.get('/verify', (req, res) => {
    const token = req.cookies.authToken;

    if (!token) {
        return res.status(401).json({ authenticated: false });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // We send authenticated AND the role so the frontend can redirect properly
        res.status(200).json({
            authenticated: true,
            role: decoded.role,  // Extraction from the token
            user: decoded
        });
    } catch (err) {
        res.status(401).json({ authenticated: false });
    }
});

// Inside your backend app.js
app.get('/user-data', (req, res) => {
    const token = req.cookies.authToken || req.cookies.authtoken;

    if (!token) return res.status(401).json({ error: "Unauthorized" });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ error: "Invalid Token" });

        const username = decoded.username;

        // JOIN the main table with the new profile pic table
        const sql = `
            SELECT 
                s.firstname, s.lastname, s.username, s.email, s.phone, s.bio, 
                s.fathername, s.fatherphone, s.course,
                p.profile_pic 
            FROM students s
            LEFT JOIN students_profile_pic p ON s.username = p.username
            WHERE s.username = ?
        `;

        db.query(sql, [username], (err, result) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ error: "Internal Server Error" });
            }

            if (result.length === 0) {
                return res.status(404).json({ error: "User not found" });
            }

            const user = result[0];

            // Sanitize and handle NULL values
            const sanitizedUser = {
                firstname: user.firstname || "",
                lastname: user.lastname || "",
                username: user.username || "",
                email: user.email || "Not Provided",
                phone: user.phone || "Not Provided",
                bio: user.bio || "No bio added yet.",
                profile_pic: user.profile_pic || null, // Sent to frontend
                fathername: user.fathername || "Not Provided",
                fatherphone: user.fatherphone || "Not Provided",
                course: user.course || "Not Provided",
                role: "students"
            };

            res.json(sanitizedUser);
        });
    });
});
app.post('/logout', (req, res) => {
    const isProduction = process.env.NODE_ENV === 'production';

    // 1. Clear the cookie
    res.clearCookie('authToken', {
        httpOnly: true,
        secure: isProduction, // Must match the original cookie settings
        sameSite: isProduction ? 'none' : 'lax',
        path: '/' // Ensure it clears for the entire domain
    });

    // 2. Send response
    res.status(200).json({
        success: true,
        message: "Logged out successfully. See you soon!"
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
        fathername,
        fatherphone,
        course,
        role="student"
    } = req.body;

    const sql = `INSERT INTO students 
                 (username, middlename, firstname, lastname, gender, email, phone, password,role,fathername,fatherphone,course) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?)`;

    const values = [username, middlename, firstname, lastname, gender, email, phone, password, role,fathername, fatherphone, course];

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
            maxAge: 46400000
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
            maxAge: 86400000
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
                { expiresIn: "1d" } // Keeping your 1-minute test limit
            );

            // Set Cookie
            const isProduction = process.env.NODE_ENV === 'production';

            res.cookie('authToken', token, {
                httpOnly: true,
                secure: isProduction, // true on Render, false on Localhost
                sameSite: isProduction ? 'none' : 'lax',
                maxAge: 86400000
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
                { expiresIn: "1d" } // Keeping your 1-minute test limit
            );

            // Set Cookie
            const isProduction = process.env.NODE_ENV === 'production';
            console.log("isproduction ",isProduction);
            
            res.cookie('authToken', token, {
                httpOnly: true,
                secure: isProduction, // true on Render, false on Localhost
                sameSite: isProduction ? 'none' : 'lax',
                maxAge: 86400000
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
                { expiresIn: "1d" } // Keeping your 1-minute test limit
            );

            // Set Cookie
            const isProduction = process.env.NODE_ENV === 'production';
            res.cookie('authToken', token, {
                httpOnly: true,
                secure: isProduction, // true on Render, false on Localhost
                sameSite: isProduction ? 'none' : 'lax',
                maxAge: 86400000
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

app.put('/edit', async (req, res) => {
    // 1. Destructure using 'profile_pic' to match your DB column
    const {
        firstname,
        lastname,
        phone,
        bio,
        profile_pic,
        fathername,
        fatherphone,
        course
    } = req.body;

    const token = req.cookies.authToken || req.cookies.authtoken;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const username = decoded.username;

        // 2. Update Student Table (Text Data)
        const updateInfoSql = `
            UPDATE students 
            SET firstname = ?, lastname = ?, phone = ?, bio = ?, fathername = ?, fatherphone = ?, course = ? 
            WHERE username = ?
        `;
        db.query(updateInfoSql, [firstname, lastname, phone, bio, fathername, fatherphone, course, username], (err) => {
            if (err) {
                console.error("Info Update Error:", err);
                return res.status(500).json({ message: "Error updating student info" });
            }

            // 3. Conditional Photo Update
            // Only run this if profile_pic has a value (isn't null or empty string)
            if (profile_pic) {
                const updatePicSql = `
                    INSERT INTO students_profile_pic (username, profile_pic) 
                    VALUES (?, ?) 
                    ON DUPLICATE KEY UPDATE profile_pic = ?
                `;

                db.query(updatePicSql, [username, profile_pic, profile_pic], (err) => {
                    if (err) {
                        console.error("Pic Update Error:", err);
                        return res.status(500).json({ message: "Error updating profile picture" });
                    }
                    sendFinalResponse(res, decoded);
                });
            } else {
                // No new photo provided, skip to response
                sendFinalResponse(res, decoded);
            }
        });

    } catch (error) {
        return res.status(403).json({ message: "Invalid session" });
    }
});

// Helper to handle the cookie/response
const sendFinalResponse = (res, decoded) => {
    const newToken = jwt.sign(
        { username: decoded.username, role: decoded.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );

    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('authToken', newToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        maxAge: 86400000
    });

    return res.status(200).json({ message: "Profile updated successfully!" });
};
// Get notifications for logged-in student
app.get('/notifications', (req, res) => {
    const token = req.cookies.authToken || req.cookies.authtoken;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const sql = `SELECT * FROM students_notification WHERE username = ? ORDER BY created_at DESC`;
    db.query(sql, [decoded.username], (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// Mark specific notification as read
app.put('/notifications/read/:id', (req, res) => {
    const sql = `UPDATE students_notification SET is_read = TRUE WHERE id = ?`;
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ success: true });
    });
});

// Clear all notifications for a student
app.delete('/notifications/clear', (req, res) => {
    const token = req.cookies.authToken || req.cookies.authtoken;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const sql = `DELETE FROM students_notification WHERE username = ?`;
    db.query(sql, [decoded.username], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ success: true });
    });
});
// 1. GET: Fetch all complaints for the logged-in user
app.get('/complaints', (req, res) => {
    const token = req.cookies.authToken || req.cookies.authtoken;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const sql = `SELECT * FROM students_complaint WHERE username = ? ORDER BY created_at DESC`;

        db.query(sql, [decoded.username], (err, results) => {
            if (err) return res.status(500).json({ error: "Database error" });
            res.json(results);
        });
    } catch (error) {
        res.status(403).json({ error: "Invalid session" });
    }
});

// 2. POST: Submit a new complaint
app.post('/complaints', (req, res) => {
    const { category, room_number, description, photo } = req.body;

    // FIX: Check for both cases like you did in the GET route
    const token = req.cookies.authToken || req.cookies.authtoken;

    if (!token) {
        console.log("No token found in cookies");
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const username = decoded.username;

        const sql = `INSERT INTO students_complaint (username, category, room_number, description, photo) VALUES (?, ?, ?, ?, ?)`;

        db.query(sql, [username, category, room_number, description, photo], (err, result) => {
            if (err) {
                // THIS LINE is critical to see the error in your terminal
                console.error("DATABASE ERROR:", err);
                return res.status(500).json({ error: "Database error", details: err.message });
            }

            const msg = `New ${category} complaint registered for Room ${room_number}.`;
            db.query(`INSERT INTO students_notification (username, message) VALUES (?, ?)`, [username, msg]);

            res.json({ success: true, message: "Complaint filed!" });
        });
    } catch (error) {
        console.error("JWT VERIFY ERROR:", error);
        res.status(403).json({ error: "Invalid session" });
    }
});
// 1. GET: Fetch leave history for logged-in user
app.get('/leave', (req, res) => {
    const token = req.cookies.authToken || req.cookies.authtoken;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const sql = `SELECT * FROM students_leave WHERE username = ? ORDER BY created_at DESC`;

        db.query(sql, [decoded.username], (err, results) => {
            if (err) return res.status(500).json({ error: "Database error" });
            res.json(results);
        });
    } catch (error) {
        res.status(403).json({ error: "Invalid session" });
    }
});

// 2. POST: Submit a new leave application
app.post('/leave', (req, res) => {
    const { room_number, from_date, to_date, destination, reason } = req.body;
    const token = req.cookies.authToken || req.cookies.authtoken;

    if (!token) return res.status(401).json({ error: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const username = decoded.username;

        const sql = `INSERT INTO students_leave (username, room_number, from_date, to_date, destination, reason) VALUES (?, ?, ?, ?, ?, ?)`;

        db.query(sql, [username, room_number, from_date, to_date, destination, reason], (err, result) => {
            if (err) {
                console.error("MYSQL ERROR:", err);
                return res.status(500).json({ error: "Database error" });
            }

            // Notification for the student
            const msg = `Leave application for ${destination} submitted successfully.`;
            db.query(`INSERT INTO students_notification (username, message) VALUES (?, ?)`, [username, msg]);

            res.json({ success: true, message: "Leave applied successfully!" });
        });
    } catch (error) {
        res.status(403).json({ error: "Invalid session" });
    }
});
// --- ADMIN PROFILE ROUTES ---

// 1. GET: Fetch Admin Data from Database
app.get("/admin-profile", verifyAdmin, (req, res) => {
    // We use the username decoded from the JWT by our middleware
    const sql = "SELECT firstname, lastname, email, phone, gender FROM admins WHERE username = ?";
    
    db.query(sql, [req.user.username], (err, result) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
        
        if (result.length === 0) {
            return res.status(404).json({ message: "Admin profile not found in database" });
        }
        
        // Send the database row back to React
        res.status(200).json(result[0]);
    });
});

// 2. PUT: Update Admin Data in Database
// GET Image using username
app.get('/api/get-profile-pic', verifyAdmin, (req, res) => {
    const username = req.user.username; // Use username to match your profile route
    const sql = "SELECT image_data FROM admin_profile_pics WHERE admin_username = ?";

    db.query(sql, [username], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ image: results.length > 0 ? results[0].image_data : null });
    });
});

// UPLOAD Image using username
app.post('/api/upload-profile-pic', verifyAdmin, (req, res) => {
    const { image } = req.body;
    const username = req.user.username; // Ensure this is what your middleware provides

    if (!image) return res.status(400).json({ error: "No image provided" });

    // Ensure the column name here matches the CREATE TABLE script above
    const sql = `
        INSERT INTO admin_profile_pics (admin_username, image_data) 
        VALUES (?, ?) 
        ON DUPLICATE KEY UPDATE image_data = VALUES(image_data)
    `;

    db.query(sql, [username, image], (err, result) => {
        if (err) {
            console.error("SQL Error:", err); // This will show in your terminal
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: "Success" });
    });
});

// 2. Retrieval Route
app.get('/api/get-profile-pic', verifyAdmin, (req, res) => {
    const email = req.user.email;
    const sql = "SELECT image_data FROM admin_profile_pics WHERE admin_email = ?";

    db.query(sql, [email], (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });

        if (results.length > 0) {
            res.status(200).json({ image: results[0].image_data });
        } else {
            res.status(200).json({ image: null });
        }
    });
});
// --- server.js / routes ---

// 1. GET all students
app.get("/admin/students", verifyAdmin, (req, res) => {
    // We select necessary fields from the students table
    const sql = "SELECT username, firstname, lastname, gender, role, status, course FROM students";
    
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ error: "Failed to fetch students" });
        }
        res.status(200).json(results);
    });
});

// 2. UPDATE student status (Approve/Reject)
app.put("/admin/students/status", verifyAdmin, (req, res) => {
    const { username, status } = req.body;

    const sql = "UPDATE students SET status = ? WHERE username = ?";
    db.query(sql, [status, username], (err, result) => {
        if (err) return res.status(500).json({ error: "Update failed" });
        res.status(200).json({ message: `Student ${status}` });
    });
});

// 3. DELETE student
app.delete("/admin/students/:username", verifyAdmin, (req, res) => {
    const username = req.params.username;

    const sql = "DELETE FROM students WHERE username = ?";
    db.query(sql, [username], (err, result) => {
        if (err) return res.status(500).json({ error: "Delete failed" });
        res.status(200).json({ message: "Student removed from database" });
    });
});
// GET Dashboard Statistics
app.get("/admin/dashboard-stats", verifyAdmin, (req, res) => {
    // Queries to get counts from different tables
    const studentCountSql = "SELECT COUNT(*) as total FROM students";
    const roomCountSql = "SELECT COUNT(*) as total FROM rooms WHERE status = 'Occupied'"; // Assuming you have a rooms table
    const complaintCountSql = "SELECT COUNT(*) as total FROM students_complaint";
    const recentStudentsSql = "SELECT firstname, lastname, course FROM students ORDER BY created_at DESC LIMIT 5";

    // Run all queries
    const p1 = new Promise((resolve, reject) => db.query(studentCountSql, (err, r) => err ? reject(err) : resolve(r[0].total)));
    const p2 = new Promise((resolve, reject) => db.query(roomCountSql, (err, r) => err ? reject(err) : resolve(r[0].total)));
    const p3 = new Promise((resolve, reject) => db.query(complaintCountSql, (err, r) => err ? reject(err) : resolve(r[0].total)));
    const p4 = new Promise((resolve, reject) => db.query(recentStudentsSql, (err, r) => err ? reject(err) : resolve(r)));

    Promise.all([p1, p2, p3, p4])
        .then(([students, rooms, complaints, list]) => {
            res.json({
                students,
                rooms,
                fees: 0, // You can add a fee sum query here later
                complaints,
                list
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: "Failed to fetch stats" });
        });
});
// 1. Get all complaints
app.get("/admin/complaints", verifyAdmin, (req, res) => {
    const sql = "SELECT * FROM students_complaint ORDER BY created_at DESC";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// 2. Update status and remark
app.put("/admin/complaints/:id", verifyAdmin, (req, res) => {
    const { status, remark } = req.body;
    const { id } = req.params;
    const sql = "UPDATE students_complaint SET status = ?, admin_remark = ? WHERE id = ?";
    db.query(sql, [status, remark, id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Updated successfully" });
    });
});

// 3. Delete complaint
app.delete("/admin/complaints/:id", verifyAdmin, (req, res) => {
    const sql = "DELETE FROM students_complaint WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Deleted" });
    });
});
app.listen(3000)