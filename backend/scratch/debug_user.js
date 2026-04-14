const db = require('../config/db');

const username = 'Aakash';
const roomNumber = '500';

console.log(`--- Checking Database for User: ${username} and Room: ${roomNumber} ---`);

// 1. Check Student Table
db.query("SELECT username, firstname, lastname, room_number FROM students WHERE username = ?", [username], (err, students) => {
    if (err) return console.error("Student DB Error:", err);
    console.log("Student Record:", JSON.stringify(students, null, 2));

    // 2. Check Room
    db.query("SELECT * FROM rooms WHERE room_number = ?", [roomNumber], (err, rooms) => {
        if (err) return console.error("Rooms DB Error:", err);
        console.log("Room Record:", JSON.stringify(rooms, null, 2));

        // 3. Check Room Requests
        db.query("SELECT * FROM room_requests WHERE username = ?", [username], (err, requests) => {
            if (err) return console.error("Requests DB Error:", err);
            console.log("All Room Requests for user:", JSON.stringify(requests, null, 2));

            process.exit(0);
        });
    });
});
