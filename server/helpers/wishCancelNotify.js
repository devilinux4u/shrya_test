require('dotenv').config();
const nodemailer = require('nodemailer');


// Function to send OTP via email
const sendOtpEmail = async (vehicle, reason) => {

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
        to: process.env.EMAIL_ADMIN, // Recipient email
        subject: 'Wishlist Vehicle Cancellation!',
        text: `Dear Admin, \n\n User id number ${vehicle.uid || "Unknown User"} canceled ${vehicle.make} ${vehicle.model} ${vehicle.year} wislist vechile booking. \n\n Reason: ${msg ? msg : 'none'} \n\nBest Regards,\nShreya Auto Team`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`wishlist cancel Notification sent successfully `);
    } catch (error) {
        console.error('Error sending notification:', error);
        throw error;
    }
};

// Export the function
module.exports = sendOtpEmail;
