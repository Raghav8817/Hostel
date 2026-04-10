const nodemailer = require('nodemailer');
require('dotenv').config({ path: './config/.env' });

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'raghavsingh8817nitin@gmail.com',
    subject: 'Test Email from Hostel App',
    text: 'If you receive this, your SMTP configuration is correct!'
};

transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
        console.error("Test Email Failed:", err);
    } else {
        console.log("Test Email Sent Successfully:", info.response);
    }
});
