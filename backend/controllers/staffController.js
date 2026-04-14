const db = require('../config/db');

exports.getStaffProfile = (req, res) => {
    const sql = "SELECT firstname, lastname, email, phone, gender, work_type, role FROM staff WHERE username = ?";
    db.query(sql, [req.user.username], (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
        if (results.length === 0) return res.status(404).json({ error: "Staff not found" });
        res.json(results[0]);
    });
};

exports.getComplaints = (req, res) => {
    const username = req.user.username;
    
    // First get work_type to filter complaints
    db.query("SELECT work_type FROM staff WHERE username = ?", [username], (err, staffResults) => {
        if (err || staffResults.length === 0) {
            return res.status(500).json({ error: "Could not fetch staff info" });
        }
        
        const workType = staffResults[0].work_type;
        
        // Define mapping between staff work_type and complaint category
        // This handles cases like "Electrician" matches "Electricity"
        let categoryQuery = workType;
        if (workType === "Electrician") categoryQuery = "Electricity";
        else if (workType === "Plumber") categoryQuery = "Water";
        else if (workType === "Cleaner") categoryQuery = "Cleaning";
        else if (workType === "IT Support") categoryQuery = "Internet";

        // Query complaints that match the work category
        // Also show 'Other' if workType is 'General' or something similar maybe? 
        // For now, exact mapping or provided workType.
        const sql = "SELECT * FROM students_complaint WHERE category = ? ORDER BY created_at DESC";
        db.query(sql, [categoryQuery], (err, complaints) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Database error fetching complaints" });
            }
            res.json({ 
                complaints, 
                workType, 
                mappedCategory: categoryQuery 
            });
        });
    });
};

exports.updateComplaintStatus = (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    
    // Allow status updates to 'In Progress' or 'Resolved'
    if (!['Pending', 'In Progress', 'Resolved'].includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
    }

    const sql = "UPDATE students_complaint SET status = ? WHERE id = ?";
    db.query(sql, [status, id], (err, result) => {
        if (err) return res.status(500).json({ error: "Failed to update status" });
        res.json({ message: `Complaint marked as ${status}` });
    });
};
