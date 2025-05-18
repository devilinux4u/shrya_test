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
            pass: process.env.EMAIL_PASS, 
        },
    });

    // Set expiration time (5 minutes from now)
    const expirationTime = new Date(Date.now() + 5 * 60 * 1000);
    const formattedTime = expirationTime.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: 'numeric', 
        hour12: true 
    });

    const mailOptions = {
        from: `"Shreya Auto" <${process.env.EMAIL_USER}>`, // Sender name and email
        to: recipientEmail, // Recipient email
        subject: 'Your Verification Code - Shreya Auto',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <h2 style="color: #333;">Verification Code</h2>
                </div>
                
                <p style="margin-bottom: 15px;">Hello,</p>
                
                <p style="margin-bottom: 15px;">Thank you for using Shreya Auto. Please use the verification code below to complete your process:</p>
                
                <div style="background-color: #f7f7f7; padding: 15px; text-align: center; margin: 20px 0; border-radius: 4px;">
                    <h1 style="letter-spacing: 5px; font-size: 32px; margin: 0; color: #333;">${otp}</h1>
                </div>
                
                <p style="margin-bottom: 15px;">This code will expire at ${formattedTime}. For security reasons, please do not share this code with anyone.</p>
                
                <p style="margin-bottom: 5px;">If you did not request this code, please ignore this email or contact our support team.</p>
                
                <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #e0e0e0;">
                    <p style="margin: 0; font-weight: bold;">Shreya Auto</p>
                    <p style="margin: 5px 0 0; color: #666; font-size: 14px;">Your trusted partner for vehicle transactions</p>
                    <p style="margin: 5px 0 0; color: #666; font-size: 14px;"><a href="https://www.shreyaauto.com" style="color: #0066cc; text-decoration: none;">www.shreyaauto.com</a></p>
                </div>
            </div>
        `,
        // Plain text version as fallback
        text: `VERIFICATION CODE: ${otp}

Hello,

Thank you for using Shreya Auto. Please use the verification code above to complete your process.

This code will expire at ${formattedTime}. For security reasons, please do not share this code with anyone.

If you did not request this code, please ignore this email or contact our support team.

Shreya Auto
Your trusted partner for vehicle transactions
www.shreyaauto.com`,
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

module.exports = sendOtpEmail;