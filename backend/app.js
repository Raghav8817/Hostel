const express=require('express');
const mysql=require('mysql2');
const cors=require('cors');
const app=express();
require('dotenv').config({ path: './.env' });

app.use(cors());
app.use(express.json());
const db=mysql.createConnection({uri:process.env.DATABASE_URL, ssl:{rejectUnauthorized:false}});
app.post('/register',(req,res)=>{
    const { firstname,middlename,lastname,email,phone,password} = req.body;
    console.log("-----------------------------------------"+firstname);
    const sql = "INSERT INTO RegStudents (firstname, middlename, lastname, email, phone, password) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(sql, [firstname, middlename, lastname, email, phone, password], (err, result) => {
    if (err) {
        console.error("Database Error:", err);
        return res.status(500).json({ error: err.message });
    }
    
    console.log("Data inserted successfully:", result);
    // Send back a success message or the result
    res.json({ message: "Student registered!", id: result.insertId });
});
});
app.listen(3000);
