const express = require('express');
const app = express();
const cors = require('cors');
const cookieparser = require('cookie-parser');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, './config/.env') });

const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const staffRoutes = require('./routes/staffRoutes');

const allowedOrigins = [
    "http://localhost:5173",           
    "https://hostel-virid.vercel.app"    
];

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"]
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieparser());

// Mount the modular routes
app.use('/', authRoutes);
app.use('/', studentRoutes);
app.use('/', adminRoutes);
app.use('/', staffRoutes);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});