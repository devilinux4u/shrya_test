require('dotenv').config();
const nodemailer = require('nodemailer');

const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: 'numeric', 
        minute: 'numeric', 
        hour12: true 
    };
    return date.toLocaleString('en-US', options).replace(/(\d+)(?=\s)/, (match) => {
        const suffix = ['th', 'st', 'nd', 'rd'][(match % 10 > 3 || [11, 12, 13].includes(match % 100)) ? 0 : match % 10];
        return match + suffix;
    });
};

// Function to send OTP via email
const cancelEmail = async (msg, data, admin) => {

    console.log(data)

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

    if (!admin) {
        mailOptions = {
            from: process.env.EMAIL_USER, // Sender email
            to: process.env.EMAIL_ADMIN, // Recipient email
            subject: 'Rental Cancellation Notification',
            text: `Dear Admin, \n\n ${data.User?.fname || "Unknown User"} canceled ${data.RentalVehicle.make} ${data.RentalVehicle.model} ${data.RentalVehicle.year} rental vehicle booking for ${formatDateTime(data.pickupDate)}. \n\n Reason: ${msg ? msg : 'none'}`
        };
    }
    else{
        mailOptions = {
            from: process.env.EMAIL_USER, // Sender email
            to: data.User?.email || "admin@example.com", // Fallback email if undefined
            subject: 'Rental Cancellation Notification',
            text: `Dear ${data.User?.fname || "Customer"}, \n\n Your booking for ${data.RentalVehicle.make} ${data.RentalVehicle.model} ${data.RentalVehicle.year} rental vehicle on ${formatDateTime(data.pickupDate)} has been canceled. \n\n Reason: ${msg ? msg : 'none'}`
        };
    }

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
