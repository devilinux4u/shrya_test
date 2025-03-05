require('dotenv').config();
const nodemailer = require('nodemailer');

/**
 * Formats a date string with ordinal suffixes (1st, 2nd, 3rd, etc.)
 * @param {string} dateString - ISO date string to format
 * @return {string} Formatted date and time
 */
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
        const num = parseInt(match, 10);
        if ([11, 12, 13].includes(num % 100)) return `${num}th`;
        const suffix = ['th', 'st', 'nd', 'rd'][Math.min(num % 10, 4)] || 'th';
        return `${num}${suffix}`;
    });
};

/**
 * Sends an appointment confirmation email to the customer
 * @param {Object} userData - User data containing contact information
 * @param {Object} appointmentData - Appointment details
 * @return {Promise<boolean>} Returns true if email sent successfully
 */
const sendConfirmationEmail = async (userData, appointmentData) => {
    console.log('Sending confirmation email to:', userData.email);

    // Configure the email transporter
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    // Format the appointment date/time for better readability
    const formattedDateTime = formatDateTime(appointmentData.date);

    const mailOptions = {
        from: `"Shreya Auto" <${process.env.EMAIL_USER}>`,
        to: userData.email,
        subject: 'Appointment Confirmation - Shreya Auto',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <h2 style="color: #333;">Appointment Confirmation</h2>
                </div>
                
                <p style="margin-bottom: 15px;">Dear ${userData.fname},</p>
                
                <p style="margin-bottom: 15px;">We're pleased to confirm your appointment at Shreya Auto scheduled for <strong>${formattedDateTime}</strong>.</p>
                
                <div style="background-color: #f7f7f7; padding: 15px; border-radius: 5px; margin-bottom: 15px;">
                    <p style="margin: 0 0 10px 0;"><strong>Appointment Details:</strong></p>
                    <p style="margin: 0 0 5px 0;">Date and Time: ${formattedDateTime}</p>
                    <p style="margin: 0;">Service Type: ${appointmentData.serviceType || 'Vehicle Service'}</p>
                </div>
                
                <p style="margin-bottom: 15px;">If you need to reschedule or have any questions, please contact our customer service team at <a href="tel:+014541713">01-4541713</a> or <a href="tel:+9779841594067">9841594067</a>.</p>
                
                <p style="margin-bottom: 15px;">We look forward to serving you.</p>
                
                <p style="margin-bottom: 5px;">Thank you for choosing Shreya Auto.</p>
                
                <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #e0e0e0;">
                    <p style="margin: 0; font-weight: bold;">Shreya Auto</p>
                    <p style="margin: 5px 0 0; color: #666; font-size: 14px;">Your trusted partner for vehicle services</p>
                    <p style="margin: 5px 0 0; color: #666; font-size: 14px;"><a href="shreyaauto.enterprises@gmail.com" style="color: #0066cc; text-decoration: none;">shreyaauto.enterprises@gmail.com</a></p>
                </div>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Confirmation email sent successfully to ${userData.email}`);
        return true;
    } catch (error) {
        console.error('Error sending confirmation email:', error);
        throw error;
    }
};

// Export the function
module.exports = sendConfirmationEmail;