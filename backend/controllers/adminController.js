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
    const roomCountSql = "SELECT COUNT(DISTINCT room_number) as total FROM students WHERE room_number IS NOT NULL";
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
    const { timeframe = 'all' } = req.query;

    const todaySql = "SELECT AVG(rating) as avgRating FROM students_food_review WHERE DATE(created_at) = CURDATE()";
    const monthSql = "SELECT AVG(rating) as avgRating FROM students_food_review WHERE MONTH(created_at) = MONTH(CURDATE()) AND YEAR(created_at) = YEAR(CURDATE())";
    const overallSql = "SELECT AVG(rating) as avgRating FROM students_food_review";

    let recentSql = "SELECT username, rating, review_text, created_at FROM students_food_review";
    if (timeframe === 'today') recentSql += " WHERE DATE(created_at) = CURDATE()";
    else if (timeframe === 'week') recentSql += " WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)";
    else if (timeframe === 'month') recentSql += " WHERE MONTH(created_at) = MONTH(CURDATE()) AND YEAR(created_at) = YEAR(CURDATE())";
    
    recentSql += " ORDER BY created_at DESC LIMIT 50";

    const p1 = new Promise((resolve, reject) => db.query(todaySql, (err, r) => err ? reject(err) : resolve(r[0].avgRating || 0)));
    const p2 = new Promise((resolve, reject) => db.query(monthSql, (err, r) => err ? reject(err) : resolve(r[0].avgRating || 0)));
    const p3 = new Promise((resolve, reject) => db.query(overallSql, (err, r) => err ? reject(err) : resolve(r[0].avgRating || 0)));
    const p4 = new Promise((resolve, reject) => db.query(recentSql, (err, r) => err ? reject(err) : resolve(r)));

    Promise.all([p1, p2, p3, p4])
        .then(([todayAvg, monthAvg, overallAvg, recentReviews]) => {
            res.json({ 
                todayAvg: parseFloat(todayAvg).toFixed(1), 
                monthAvg: parseFloat(monthAvg).toFixed(1), 
                overallAvg: parseFloat(overallAvg).toFixed(1),
                recentReviews 
            });
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
    console.log(`ATTEMPTING APPROVAL: ID=${id}, User=${username}, Room=${room_number}`);
    
    db.query("SELECT capacity, current_occupancy FROM rooms WHERE room_number = ?", [room_number], (err, roomRes) => {
        if (err) return res.status(500).json({ error: "Database error" });
        if (roomRes.length === 0) return res.status(404).json({ error: "Room not found" });
        if (roomRes[0].current_occupancy >= roomRes[0].capacity) return res.status(400).json({ error: "Room is already full" });

        // 1. Update Request
        db.query("UPDATE room_requests SET status = 'Approved' WHERE id = ?", [id], (err, res1) => {
            if (err) {
                console.error("PHASE 1 ERROR:", err);
                return res.status(500).json({ error: "Failed to update request" });
            }
            if (res1.affectedRows === 0) {
                console.warn(`PHASE 1 WARN: No request found with ID ${id}`);
                return res.status(404).json({ error: "Request not found or already processed" });
            }
            console.log(`PHASE 1 SUCCESS: Rows affected: ${res1.affectedRows}`);

            // 2. Assign student to room
            db.query("UPDATE students SET room_number = ? WHERE username = ?", [room_number, username], (err, res2) => {
                if (err) {
                    console.error("PHASE 2 ERROR:", err);
                    return res.status(500).json({ error: "Failed to assign student" });
                }
                if (res2.affectedRows === 0) {
                    console.warn(`PHASE 2 WARN: No student found with username ${username}`);
                    return res.status(404).json({ error: "Student record not found" });
                }
                console.log(`PHASE 2 SUCCESS: Rows affected: ${res2.affectedRows}`);

                // 3. Update room occupancy
                const newOcc = roomRes[0].current_occupancy + 1;
                const newStatus = newOcc >= roomRes[0].capacity ? 'Full' : 'Available';
                
                db.query("UPDATE rooms SET current_occupancy = ?, status = ? WHERE room_number = ?", [newOcc, newStatus, room_number], (err, res3) => {
                    if (err) {
                        console.error("PHASE 3 ERROR:", err);
                        return res.status(500).json({ error: "Failed to update room stats" });
                    }
                    console.log(`PHASE 3 SUCCESS: Rows affected: ${res3.affectedRows}`);
                    
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

exports.getAllStaff = (req, res) => {
    const sql = "SELECT username, firstname, lastname, gender, role, work_type, email, phone FROM staff";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ error: "Failed to fetch staff members" });
        }
        res.status(200).json(results);
    });
};

exports.deleteStaff = (req, res) => {
    const username = req.params.username;
    const sql = "DELETE FROM staff WHERE username = ?";
    db.query(sql, [username], (err, result) => {
        if (err) return res.status(500).json({ error: "Delete failed" });
        res.status(200).json({ message: "Staff member removed from database" });
    });
};

exports.assignRoom = (req, res) => {
    const { username, room_number } = req.body;
    console.log(`ADMIN MANUAL ASSIGN: User=${username}, NewRoom=${room_number}`);

    db.query("SELECT room_number FROM students WHERE username = ?", [username], (err, sRes) => {
        if (err) return res.status(500).json({ error: "Database error" });
        if (sRes.length === 0) return res.status(404).json({ error: "Student not found" });

        const oldRoom = sRes[0].room_number;

        db.query("SELECT capacity, current_occupancy FROM rooms WHERE room_number = ?", [room_number], (err, rRes) => {
            if (err) return res.status(500).json({ error: "Database error" });
            if (rRes.length === 0) return res.status(404).json({ error: "Target room not found" });
            if (rRes[0].current_occupancy >= rRes[0].capacity) return res.status(400).json({ error: "Target room is full" });

            const decrementOld = oldRoom ? new Promise((resolve) => {
                db.query("UPDATE rooms SET current_occupancy = GREATEST(0, current_occupancy - 1), status = 'Available' WHERE room_number = ?", [oldRoom], (e) => resolve());
            }) : Promise.resolve();

            decrementOld.then(() => {
                db.query("UPDATE rooms SET current_occupancy = current_occupancy + 1 WHERE room_number = ?", [room_number], (err) => {
                    if (err) return res.status(500).json({ error: "Failed to update new room occupancy" });

                    db.query("UPDATE students SET room_number = ?, status = 'Approved' WHERE username = ?", [room_number, username], (err) => {
                        if (err) return res.status(500).json({ error: "Failed to update student record" });

                        db.query("INSERT INTO students_notification (username, message) VALUES (?, ?)", [username, `Admin has assigned you to Room ${room_number}.`], () => {
                            res.json({ success: true, message: `Student assigned to Room ${room_number}` });
                        });
                    });
                });
            });
        });
    });
};
