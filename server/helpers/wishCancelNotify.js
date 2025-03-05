require('dotenv').config();
const nodemailer = require('nodemailer');

// Function to send wishlist cancellation notification to admin
const sendWishlistCancelEmail = async (name, vehicle, msg) => {
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
    
    // Format current date and time
    const currentDate = new Date().toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    });
    
    // Create a clean vehicle description
    const vehicleDescription = `${vehicle.year} ${vehicle.make} ${vehicle.model}${vehicle.trim ? ' ' + vehicle.trim : ''}`;

    const mailOptions = {
        from: `"Shreya Auto System" <${process.env.EMAIL_USER}>`, // Sender name and email
        to: process.env.EMAIL_ADMIN, // Admin email
        subject: `Wishlist Cancellation Alert: ${vehicleDescription}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
                <div style="text-align: center; margin-bottom: 20px; background-color: #f8f8f8; padding: 15px; border-radius: 4px;">
                    <h2 style="color: #d32f2f; margin: 0;">Wishlist Cancellation Alert</h2>
                </div>
                
                <p style="margin-bottom: 15px;">Dear Admin,</p>
                
                <p style="margin-bottom: 15px;">This is an automated notification regarding a wishlist cancellation in the system.</p>
                
                <div style="background-color: #f7f7f7; padding: 15px; margin: 20px 0; border-left: 4px solid #d32f2f; border-radius: 4px;">
                    <h3 style="margin-top: 0; color: #333;">Cancellation Details:</h3>
                    <p style="margin: 5px 0;"><strong>User:</strong> ${name || "Unknown User"}</p>
                    <p style="margin: 5px 0;"><strong>Vehicle:</strong> ${vehicleDescription}</p>
    
                    <p style="margin: 5px 0;"><strong>Cancellation Time:</strong> ${currentDate}</p>
                    <p style="margin: 5px 0;"><strong>Reason Provided:</strong> ${msg ? msg : 'No reason provided'}</p>
                </div>
                
                <p style="margin-bottom: 15px;">This vehicle should be updated in the inventory system accordingly.</p>
                
                <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #e0e0e0;">
                    <p style="margin: 0; font-weight: bold;">Shreya Auto System</p>
                    <p style="margin: 5px 0 0; color: #666; font-size: 14px;">Automated Notification - Please Do Not Reply</p>
                </div>
            </div>
        `,
        // Plain text version as fallback
        text: `WISHLIST CANCELLATION ALERT

Dear Admin,

This is an automated notification regarding a wishlist cancellation in the system.

CANCELLATION DETAILS:
User: ${name || "Unknown User"}
Vehicle: ${vehicleDescription}
Cancellation Time: ${currentDate}
Reason Provided: ${msg ? msg : 'No reason provided'}

This vehicle should be updated in the inventory system accordingly.

Shreya Auto System
Automated Notification - Please Do Not Reply`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Wishlist cancellation notification sent successfully to admin.');
        return true;
    } catch (error) {
        console.error('Error sending wishlist cancellation notification:', error.message);
        throw error;
    }
};

// Export the function
module.exports = sendWishlistCancelEmail;