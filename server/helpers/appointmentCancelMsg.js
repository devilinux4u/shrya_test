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
const cancelEmail = async (udata, adata) => {

    console.log(udata)

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

    mailOptions = {
        from: process.env.EMAIL_USER, // Sender email
        to: udata.email, // Recipient email
        subject: 'Appointment Cancellation Notification',
        text: `Dear ${udata.fname}, \n\n Your appointment for buy/sell vechile on ${adata.date} has been canceled. \n\n Shreya Auto\n Thank you!`,
    };



    try {
        await transporter.sendMail(mailOptions);
        console.log(`Notification sent for appointment cancellation`);
    } catch (error) {
        console.error('Error sending notification:', error);
        throw error;
    }
};

// Export the function
module.exports = cancelEmail;
