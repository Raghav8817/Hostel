const express = require('express');
const cors = require('cors');
const cookie = require('cookie-parser');
require('dotenv').config({ path: './.env' });

const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware integration
app.use(cors({
    origin: [ 'http://localhost:5173', process.env.FRONTEND_URL ], // Auto-accepts requests from Netlify and Local
    credentials: true                
}));
app.use(cookie());
app.use(express.json());

// Main Modular Routes Registration
app.use('/', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening securely on port ${PORT}`);
});
