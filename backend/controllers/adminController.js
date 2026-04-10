const db = require('../config/db');

exports.getProfile = (req, res) => {
    const sql = "SELECT firstname, lastname, email, phone, gender FROM admins WHERE username = ?";
    db.query(sql, [req.user.username], (err, result) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
        if (result.length === 0) return res.status(404).json({ message: "Admin profile not found in database" });
        res.status(200).json(result[0]);
    });
};

// GET Image using username (This was duplicate route in app.js, one using req.user.username and another using req.user.email)
exports.getProfilePic = (req, res) => {
    const username = req.user.username;
    // We will favor the one using username, since the old app.js had two overlapping routes with same exact path!
    // But let's check `admin_email` if `admin_username` route from app.js fails: 
    // Wait, let's keep what they had:
    const sql = "SELECT image_data FROM admin_profile_pics WHERE admin_username = ?";
    db.query(sql, [username], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length > 0) {
            res.json({ image: results[0].image_data });
        } else {
            // fallback to email query if there's no username pic? Let's just return null.
            res.json({ image: null });
        }
    });
};

exports.uploadProfilePic = (req, res) => {
    const { image } = req.body;
    const username = req.user.username;
    if (!image) return res.status(400).json({ error: "No image provided" });

    const sql = `INSERT INTO admin_profile_pics (admin_username, image_data) VALUES (?, ?) ON DUPLICATE KEY UPDATE image_data = VALUES(image_data)`;
    db.query(sql, [username, image], (err, result) => {
        if (err) {
            console.error("SQL Error:", err);
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: "Success" });
    });
};

exports.getAllStudents = (req, res) => {
    const sql = "SELECT username, firstname, lastname, gender, role, status, course, room_number FROM students";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ error: "Failed to fetch students" });
        }
        res.status(200).json(results);
    });
};

exports.updateStudentStatus = (req, res) => {
    const { username, status } = req.body;
    const sql = "UPDATE students SET status = ? WHERE username = ?";
    db.query(sql, [status, username], (err, result) => {
        if (err) return res.status(500).json({ error: "Update failed" });
        res.status(200).json({ message: `Student ${status}` });
    });
};

exports.deleteStudent = (req, res) => {
    const username = req.params.username;
    const sql = "DELETE FROM students WHERE username = ?";
    db.query(sql, [username], (err, result) => {
        if (err) return res.status(500).json({ error: "Delete failed" });
        res.status(200).json({ message: "Student removed from database" });
    });
};

exports.getDashboardStats = (req, res) => {
    const studentCountSql = "SELECT COUNT(*) as total FROM students";
    const roomCountSql = "SELECT COUNT(*) as total FROM rooms WHERE status = 'Full' OR current_occupancy > 0";
    const complaintCountSql = "SELECT COUNT(*) as total FROM students_complaint";
    const recentStudentsSql = "SELECT CONCAT(firstname, ' ', lastname) as name, room_number as room, 'Paid' as fees FROM students ORDER BY created_at DESC LIMIT 5";

    const p1 = new Promise((resolve, reject) => db.query(studentCountSql, (err, r) => err ? reject(err) : resolve(r[0].total)));
    const p2 = new Promise((resolve, reject) => db.query(roomCountSql, (err, r) => err ? reject(err) : resolve(r[0].total)));
    const p3 = new Promise((resolve, reject) => db.query(complaintCountSql, (err, r) => err ? reject(err) : resolve(r[0].total)));
    const p4 = new Promise((resolve, reject) => db.query(recentStudentsSql, (err, r) => err ? reject(err) : resolve(r)));

    Promise.all([p1, p2, p3, p4])
        .then(([students, rooms, complaints, list]) => {
            res.json({ students, rooms, fees: 0, complaints, list });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: "Failed to fetch stats" });
        });
};

exports.getAllComplaints = (req, res) => {
    const sql = "SELECT * FROM students_complaint ORDER BY created_at DESC";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
};

exports.updateComplaintStatus = (req, res) => {
    const { status, remark } = req.body;
    const { id } = req.params;
    const sql = "UPDATE students_complaint SET status = ?, admin_remark = ? WHERE id = ?";
    db.query(sql, [status, remark, id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Updated successfully" });
    });
};

exports.deleteComplaint = (req, res) => {
    const sql = "DELETE FROM students_complaint WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Deleted" });
    });
};

exports.getFoodReviews = (req, res) => {
    const todaySql = "SELECT AVG(rating) as avgRating FROM students_food_review WHERE DATE(created_at) = CURDATE()";
    const monthSql = "SELECT AVG(rating) as avgRating FROM students_food_review WHERE MONTH(created_at) = MONTH(CURDATE()) AND YEAR(created_at) = YEAR(CURDATE())";
    const recentSql = "SELECT username, rating, review_text, created_at FROM students_food_review ORDER BY created_at DESC LIMIT 10";

    const p1 = new Promise((resolve, reject) => db.query(todaySql, (err, r) => err ? reject(err) : resolve(r[0].avgRating || 0)));
    const p2 = new Promise((resolve, reject) => db.query(monthSql, (err, r) => err ? reject(err) : resolve(r[0].avgRating || 0)));
    const p3 = new Promise((resolve, reject) => db.query(recentSql, (err, r) => err ? reject(err) : resolve(r)));

    Promise.all([p1, p2, p3])
        .then(([todayAvg, monthAvg, recentReviews]) => {
            res.json({ todayAvg: parseFloat(todayAvg).toFixed(1), monthAvg: parseFloat(monthAvg).toFixed(1), recentReviews });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: "Failed to fetch food review stats" });
        });
};

exports.getRoomsAdvanced = (req, res) => {
    const sqlRooms = "SELECT * FROM rooms";
    const sqlStudents = "SELECT username, firstname, lastname, gender, room_number FROM students WHERE room_number IS NOT NULL";
    
    db.query(sqlRooms, (err, rooms) => {
        if (err) return res.status(500).json({ error: "Failed to fetch rooms" });
        db.query(sqlStudents, (err, students) => {
            if (err) return res.status(500).json({ error: "Failed to fetch students in rooms" });
            
            const detailedRooms = rooms.map(room => {
                return {
                    no: room.room_number,
                    type: room.room_type,
                    cap: room.capacity,
                    ac: room.room_type.includes("AC") ? "AC" : "Non-AC", // Just mock mapping if not explicit
                    students: students.filter(s => s.room_number === room.room_number).map(s => ({
                        name: s.firstname + (s.lastname ? " " + s.lastname : ""),
                        gender: s.gender || "Unknown"
                    }))
                };
            });
            res.status(200).json(detailedRooms);
        });
    });
};

exports.getRoomRequests = (req, res) => {
    const sql = `
        SELECT r.id, r.username, r.room_number, r.status, r.created_at, s.firstname, s.lastname, s.gender, s.course
        FROM room_requests r
        JOIN students s ON r.username = s.username
        WHERE r.status = 'Pending'
        ORDER BY r.created_at DESC
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json(results);
    });
};

exports.approveRoomRequest = (req, res) => {
    const { id, username, room_number } = req.body;
    
    // Check if room has capacity first
    db.query("SELECT capacity, current_occupancy FROM rooms WHERE room_number = ?", [room_number], (err, roomRes) => {
        if (err) return res.status(500).json({ error: "Database error" });
        if (roomRes.length === 0) return res.status(404).json({ error: "Room not found" });
        
        if (roomRes[0].current_occupancy >= roomRes[0].capacity) {
            return res.status(400).json({ error: "Room is already full" });
        }

        // 1. Update Request
        db.query("UPDATE room_requests SET status = 'Approved' WHERE id = ?", [id], (err) => {
            if (err) return res.status(500).json({ error: "Failed to update request" });

            // 2. Assign student to room
            db.query("UPDATE students SET room_number = ? WHERE username = ?", [room_number, username], (err) => {
                if (err) return res.status(500).json({ error: "Failed to assign student" });

                // 3. Update room occupancy
                const newOcc = roomRes[0].current_occupancy + 1;
                const newStatus = newOcc >= roomRes[0].capacity ? 'Full' : 'Available';
                
                db.query("UPDATE rooms SET current_occupancy = ?, status = ? WHERE room_number = ?", [newOcc, newStatus, room_number], (err) => {
                    if (err) return res.status(500).json({ error: "Failed to update room stats" });
                    
                    // Add a notification for the student
                    db.query("INSERT INTO students_notification (username, message) VALUES (?, ?)", [username, `Your application for Room ${room_number} was approved!`], () => {
                        res.json({ success: true, message: "Room assigned successfully" });
                    });
                });
            });
        });
    });
};

exports.rejectRoomRequest = (req, res) => {
    const { id, username, room_number } = req.body;
    db.query("UPDATE room_requests SET status = 'Rejected' WHERE id = ?", [id], (err) => {
        if (err) return res.status(500).json({ error: "Database error" });
        
        db.query("INSERT INTO students_notification (username, message) VALUES (?, ?)", [username, `Your application for Room ${room_number} was rejected. Please apply for another.`], () => {
            res.json({ success: true, message: "Request rejected" });
        });
    });
};
