require('dotenv').config();
const nodemailer = require('nodemailer');


// Function to send OTP via email
const cancelEmail = async (msg, data) => {

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
        subject: 'Rental Cancellation Notification',
        text: `Dear Admin, \n\n ${data.user.uname} canceled ${data.rentVehicle.make} ${data.rentVehicle.model} ${data.rentVehicle.year} rental vechile booking for ${data.pickupDate}. \n\n Reason: ${msg ? msg : 'none'}`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Notification sent for cancellation`);
    } catch (error) {
        console.error('Error sending notification:', error);
        throw error;
    }
};

// Export the function
module.exports = cancelEmail;
