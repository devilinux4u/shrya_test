require('dotenv').config();
const nodemailer = require('nodemailer');


// Function to send OTP via email
const sendOtpEmail = async (recipientEmail, otp) => {

    // Configure the email transporter
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
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
        subject: 'Your OTP Code',
        text: `Your One-Time Password (OTP) is: ${otp}. Please use this code within 5 minutes to complete your verification process.`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`OTP sent successfully to ${recipientEmail}`);
        return otp; // Return OTP to verify later
    } catch (error) {
        console.error('Error sending OTP:', error);
        throw error;
    }
};

// Export the function
module.exports = sendOtpEmail;
