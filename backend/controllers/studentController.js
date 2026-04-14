const jwt = require("jsonwebtoken");
const db = require('../config/db');

exports.getUserData = (req, res) => {
    const token = req.cookies.authToken || req.cookies.authtoken;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ error: "Invalid Token" });

        const username = decoded.username;
        const sql = `
            SELECT s.firstname, s.lastname, s.username, s.email, s.phone, s.bio, s.fathername, s.fatherphone, s.course, p.profile_pic 
            FROM students s
            LEFT JOIN students_profile_pic p ON s.username = p.username
            WHERE s.username = ?
        `;

        db.query(sql, [username], (err, result) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ error: "Internal Server Error" });
            }

            if (result.length === 0) return res.status(404).json({ error: "User not found" });

            const user = result[0];
            const sanitizedUser = {
                firstname: user.firstname || "",
                lastname: user.lastname || "",
                username: user.username || "",
                email: user.email || "Not Provided",
                phone: user.phone || "Not Provided",
                bio: user.bio || "No bio added yet.",
                profile_pic: user.profile_pic || null,
                fathername: user.fathername || "Not Provided",
                fatherphone: user.fatherphone || "Not Provided",
                course: user.course || "Not Provided",
                role: "students"
            };

            res.json(sanitizedUser);
        });
    });
};

const sendFinalResponse = (res, decoded) => {
    const newToken = jwt.sign({ username: decoded.username, role: decoded.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('authToken', newToken, { httpOnly: true, secure: isProduction, sameSite: isProduction ? 'none' : 'lax', maxAge: 86400000 });
    return res.status(200).json({ message: "Profile updated successfully!" });
};

exports.editProfile = async (req, res) => {
    const { firstname, lastname, phone, bio, profile_pic, fathername, fatherphone, course } = req.body;
    const token = req.cookies.authToken || req.cookies.authtoken;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const username = decoded.username;

        const updateInfoSql = `UPDATE students SET firstname = ?, lastname = ?, phone = ?, bio = ?, fathername = ?, fatherphone = ?, course = ? WHERE username = ?`;
        db.query(updateInfoSql, [firstname, lastname, phone, bio, fathername, fatherphone, course, username], (err) => {
            if (err) {
                console.error("Info Update Error:", err);
                return res.status(500).json({ message: "Error updating student info" });
            }

            if (profile_pic) {
                const updatePicSql = `INSERT INTO students_profile_pic (username, profile_pic) VALUES (?, ?) ON DUPLICATE KEY UPDATE profile_pic = ?`;
                db.query(updatePicSql, [username, profile_pic, profile_pic], (err) => {
                    if (err) {
                        console.error("Pic Update Error:", err);
                        return res.status(500).json({ message: "Error updating profile picture" });
                    }
                    sendFinalResponse(res, decoded);
                });
            } else {
                sendFinalResponse(res, decoded);
            }
        });
    } catch (error) {
        return res.status(403).json({ message: "Invalid session" });
    }
};

exports.getNotifications = (req, res) => {
    const token = req.cookies.authToken || req.cookies.authtoken;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const sql = `SELECT * FROM students_notification WHERE username = ? ORDER BY created_at DESC`;
    db.query(sql, [decoded.username], (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
};

exports.markNotificationRead = (req, res) => {
    const sql = `UPDATE students_notification SET is_read = TRUE WHERE id = ?`;
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ success: true });
    });
};

exports.clearNotifications = (req, res) => {
    const token = req.cookies.authToken || req.cookies.authtoken;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const sql = `DELETE FROM students_notification WHERE username = ?`;
    db.query(sql, [decoded.username], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ success: true });
    });
};

exports.getComplaints = (req, res) => {
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
};

exports.postComplaint = (req, res) => {
    const { category, room_number, description, photo } = req.body;
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
};

exports.getLeaveHistory = (req, res) => {
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
};

exports.applyLeave = (req, res) => {
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

            const msg = `Leave application for ${destination} submitted successfully.`;
            db.query(`INSERT INTO students_notification (username, message) VALUES (?, ?)`, [username, msg]);

            res.json({ success: true, message: "Leave applied successfully!" });
        });
    } catch (error) {
        res.status(403).json({ error: "Invalid session" });
    }
};

exports.submitFoodReview = (req, res) => {
    const { rating, review_text } = req.body;
    const token = req.cookies.authToken || req.cookies.authtoken;

    if (!token) return res.status(401).json({ error: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const username = decoded.username;

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ error: "Rating must be between 1 and 5" });
        }

        // Check if user already submitted a review today
        const checkSql = `SELECT id FROM students_food_review WHERE username = ? AND DATE(created_at) = CURDATE()`;
        db.query(checkSql, [username], (err, results) => {
            if (err) return res.status(500).json({ error: "Database error" });
            if (results.length > 0) {
                return res.status(400).json({ error: "You have already submitted a review for today." });
            }

            const sql = `INSERT INTO students_food_review (username, rating, review_text) VALUES (?, ?, ?)`;
            db.query(sql, [username, rating, review_text], (err, result) => {
                if (err) {
                    console.error("MYSQL ERROR:", err);
                    return res.status(500).json({ error: "Database error" });
                }
                res.json({ success: true, message: "Food review submitted successfully!" });
            });
        });
    } catch (error) {
        res.status(403).json({ error: "Invalid session" });
    }
};

exports.getMonthlyFoodReview = (req, res) => {
    const token = req.cookies.authToken || req.cookies.authtoken;
    let username = null;
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            username = decoded.username;
        } catch (e) { }
    }

    const sql = `
        SELECT 
            DATE(created_at) AS review_date,
            ROUND(AVG(rating), 2) AS avg_rating,
            COUNT(*) AS total_reviews
        FROM students_food_review
        WHERE MONTH(created_at) = MONTH(CURDATE())
          AND YEAR(created_at) = YEAR(CURDATE())
        GROUP BY DATE(created_at)
        ORDER BY review_date ASC
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });

        const overallSql = `
            SELECT 
                ROUND(AVG(rating), 2) AS monthly_avg,
                COUNT(*) AS total_reviews,
                SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) AS five_star,
                SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) AS four_star,
                SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) AS three_star,
                SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) AS two_star,
                SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) AS one_star
            FROM students_food_review
            WHERE MONTH(created_at) = MONTH(CURDATE())
              AND YEAR(created_at) = YEAR(CURDATE())
        `;
        db.query(overallSql, (err2, overall) => {
            if (err2) return res.status(500).json({ error: "Database error" });

            if (username) {
                const checkSql = `SELECT id FROM students_food_review WHERE username = ? AND DATE(created_at) = CURDATE()`;
                db.query(checkSql, [username], (err3, checkResult) => {
                    const userHasReviewedToday = (!err3 && checkResult.length > 0);
                    res.json({ daily: results, summary: overall[0], userHasReviewedToday });
                });
            } else {
                res.json({ daily: results, summary: overall[0], userHasReviewedToday: false });
            }
        });
    });
};

exports.getAvailableRooms = (req, res) => {
    const token = req.cookies.authToken || req.cookies.authtoken;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    try {
        jwt.verify(token, process.env.JWT_SECRET);
        const sql = "SELECT room_number, room_type, capacity, current_occupancy, status FROM rooms WHERE status != 'Full' AND current_occupancy < capacity";
        db.query(sql, (err, results) => {
            if (err) return res.status(500).json({ error: "Database error" });
            res.json(results);
        });
    } catch (error) {
        res.status(403).json({ error: "Invalid session" });
    }
};

exports.applyForRoom = (req, res) => {
    const { room_number } = req.body;
    const token = req.cookies.authToken || req.cookies.authtoken;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const username = decoded.username;

        const checkSql = "SELECT * FROM room_requests WHERE username = ? AND status = 'Pending'";
        db.query(checkSql, [username], (err, results) => {
            if (err) return res.status(500).json({ error: "Database error" });
            if (results.length > 0) return res.status(400).json({ error: "You already have a pending request." });

            const sql = "INSERT INTO room_requests (username, room_number) VALUES (?, ?)";
            db.query(sql, [username, room_number], (err, result) => {
                if (err) return res.status(500).json({ error: "Database error" });
                res.json({ success: true, message: "Applied for room successfully." });
            });
        });
    } catch (error) {
        res.status(403).json({ error: "Invalid session" });
    }
};

exports.getRoomStatus = (req, res) => {
    const token = req.cookies.authToken || req.cookies.authtoken;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const username = decoded.username;

        // 1. Check if a room is already assigned in the students table (PRIORITY)
        db.query("SELECT room_number FROM students WHERE username = ?", [username], (err, sResults) => {
            if (err) return res.status(500).json({ error: "Database error" });
            
            const assignedRoom = sResults[0]?.room_number;
            console.log(`DEBUG: Student ${username} assigned room check:`, assignedRoom);

            if (assignedRoom) {
                return res.json({ status: "Assigned", room: assignedRoom });
            }

            // 2. If no room assigned, check for pending requests
            db.query("SELECT room_number, status FROM room_requests WHERE username = ? AND status = 'Pending'", [username], (err, rResults) => {
                if (err) return res.status(500).json({ error: "Database error" });
                
                console.log(`DEBUG: Student ${username} pending requests count:`, rResults.length);
                
                if (rResults.length > 0) {
                    return res.json({ status: "Pending", room: rResults[0].room_number });
                }
                
                // 3. No room and no pending requests
                res.json({ status: "None" });
            });
        });
    } catch (error) {
        res.status(403).json({ error: "Invalid session" });
    }
};

exports.getTodayMenu = (req, res) => {
    const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    const today = days[new Date().getDay()];

    const sql = `SELECT * FROM mess_menu WHERE day = ?`;
    db.query(sql, [today], (err, results) => {
        if (err) {
            console.error("Database error fetching menu:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: "Menu not found for today" });
        }
        res.json(results[0]);
    });
};
