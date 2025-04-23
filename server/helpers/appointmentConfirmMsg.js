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

// Function to send cancellation email notification
const cancelEmail = async (udata, adata) => {
    console.log(udata);

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

    // Format the appointment date/time for better readability
    const formattedDateTime = formatDateTime(adata.date);

    const mailOptions = {
        from: `"Shreya Auto" <${process.env.EMAIL_USER}>`, // Sender name and email
        to: udata.email, // Recipient email
        subject: 'Appointment Confirmation Notification - Shreya Auto',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <h2 style="color: #333;">Appointment Confirmation</h2>
                </div>
                
                <p style="margin-bottom: 15px;">Dear ${udata.fname},</p>
                
                <p style="margin-bottom: 15px;">We're writing to inform you that your vehicle appointment scheduled for <strong>${formattedDateTime}</strong> has been confirmed.</p>
                
                <p style="margin-bottom: 15px;">Please contact our customer service team at <a href="tel:+1234567890">(123) 456-7890</a> or reply to this email.</p>
                
                <p style="margin-bottom: 5px;">Thank you.</p>
                
                <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #e0e0e0;">
                    <p style="margin: 0; font-weight: bold;">Shreya Auto</p>
                    <p style="margin: 5px 0 0; color: #666; font-size: 14px;">Your trusted partner for vehicle transactions</p>
                    <p style="margin: 5px 0 0; color: #666; font-size: 14px;"><a href="https://www.shreyaauto.com" style="color: #0066cc; text-decoration: none;">www.shreyaauto.com</a></p>
                </div>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Cancellation notification sent successfully to ${udata.email}`);
        return true;
    } catch (error) {
        console.error('Error sending cancellation notification:', error);
        throw error;
    }
};

// Export the function
module.exports = cancelEmail;