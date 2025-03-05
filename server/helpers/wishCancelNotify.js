require('dotenv').config();
const nodemailer = require('nodemailer');


// Function to send OTP via email
const sendOtpEmail = async (name, vehicle, msg) => {

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
        text: `Dear Admin, 

User ${name || "Unknown User"} canceled ${vehicle.make} ${vehicle.model} ${vehicle.year} wishlist vehicle booking. 

Reason: ${msg ? msg : 'none'} 

Best Regards,
Shreya Auto Team`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Wishlist cancel notification sent successfully.');
    } catch (error) {
        console.error('Error sending wishlist cancel notification:', error.message);
        throw error;
    }
};

// Export the function
module.exports = sendOtpEmail;