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
 * Sends an appointment cancellation email to the customer
 * @param {Object} userData - User data containing contact information
 * @param {Object} appointmentData - Appointment details
 * @param {string} [message] - Optional cancellation reason
 * @return {Promise<boolean>} Returns true if email sent successfully
 */
const sendCancellationEmail = async (userData, appointmentData, message) => {
    console.log('Sending cancellation email to:', userData.email);

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
        subject: 'Appointment Cancellation Notice - Shreya Auto',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <h2 style="color: #333;">Appointment Cancellation</h2>
                </div>
                
                <p style="margin-bottom: 15px;">Dear ${userData.fname},</p>
                
                <p style="margin-bottom: 15px;">We regret to inform you that your appointment scheduled for <strong>${formattedDateTime}</strong> for  <strong>${appointmentData.vehicleMake} ${appointmentData.vehicleModel} (${appointmentData.vehicleYear})</strong> at <strong>${appointmentData.location || 'Shreya Auto Service Center'}</strong> has been cancelled.</p>
                
                <div style="background-color: #f7f7f7; padding: 15px; border-radius: 5px; margin-bottom: 15px;">
                    <p style="margin: 0 0 10px 0;"><strong>Cancelled Appointment Details:</strong></p>
                    <p style="margin: 0 0 5px 0;">Date and Time: ${formattedDateTime}</p>
                    <p style="margin: 0 0 5px 0;">Location: ${appointmentData.location || 'Shreya Auto Service Center'}</p>
                    ${message ? `<p style="margin: 10px 0 0 0;"><strong>Reason for cancellation:</strong> ${message}</p>` : ''}
                </div>
            
                
                <p style="margin-bottom: 5px;">We apologize for any inconvenience this may cause and appreciate your understanding.</p>
                
                <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #e0e0e0;">
                    <p style="margin: 0; font-weight: bold;">Shreya Auto</p>
                    <p style="margin: 5px 0 0; color: #666; font-size: 14px;">Your trusted partner for vehicle services</p>
                    <p style="margin: 5px 0 0; color: #666; font-size: 14px;"><a href="https://www.shreyaauto.com" style="color: #0066cc; text-decoration: none;">www.shreyaauto.com</a></p>
                </div>
            </div>
        `,
        // Plain text version as fallback
        text: `Dear ${userData.fname},

We regret to inform you that your appointment at Shreya Auto scheduled for ${formattedDateTime} for your ${appointmentData.vehicleMake} ${appointmentData.vehicleModel} (${appointmentData.vehicleYear}) at ${appointmentData.location || 'Shreya Auto Service Center'} has been cancelled.

Cancelled Appointment Details:
- Date and Time: ${formattedDateTime}
- Location: ${appointmentData.location || 'Shreya Auto Service Center'}
- Vehicle: ${appointmentData.vehicleMake} ${appointmentData.vehicleModel} (${appointmentData.vehicleYear})
${message ? `- Reason for cancellation: ${message}` : ''}

If you would like to reschedule your appointment or have any questions, please contact our customer service team at 01-4541713 or 9841594067.

We apologize for any inconvenience this may cause and appreciate your understanding.

Shreya Auto
Your trusted partner for vehicle services
www.shreyaauto.com`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Cancellation notification sent successfully to ${userData.email}`);
        return true;
    } catch (error) {
        console.error('Error sending cancellation notification:', error);
        throw error;
    }
};

// Export the function
module.exports = sendCancellationEmail;