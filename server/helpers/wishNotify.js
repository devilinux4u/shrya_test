require('dotenv').config();
const nodemailer = require('nodemailer');


// Function to send OTP via email
const sendOtpEmail = async (recipientEmail, name, vehicle) => {

    // Configure the email transporter
    const transporter = nodemailer.createTransport({
        host: 'smtp.zoho.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS, // App password (set in .env)
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER, // Sender email
        to: recipientEmail, // Recipient email
        subject: 'Your Wishlist Vehicle is Now Available!',
        text: `Hello ${name},\n\nGreat news! The vehicle you wished for (${vehicle}) is now available. Check it out on our website.\n\nBest Regards,\nShreya Auto Team`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Notification sent successfully to ${recipientEmail}`);
    } catch (error) {
        console.error('Error sending notification:', error);
        throw error;
    }
};

// Export the function
module.exports = sendOtpEmail;
