require('dotenv').config();
const nodemailer = require('nodemailer');

// Function to send wishlist availability notification via email
const sendWishlistNotification = async (recipientEmail, name, vehicleDetails) => {
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

    // Create HTML content with detailed vehicle information
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Wishlist Vehicle Available</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
            }
            .header {
                background-color: #f0f7ff;
                padding: 20px;
                text-align: center;
                border-bottom: 3px solid #3498db;
            }
            .content {
                padding: 20px;
            }
            .footer {
                background-color: #f8f8f8;
                padding: 15px;
                text-align: center;
                font-size: 12px;
                color: #777;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin: 20px 0;
            }
            table, th, td {
                border: 1px solid #ddd;
            }
            th {
                background-color: #f2f2f2;
                padding: 12px;
                text-align: left;
                width: 40%;
            }
            td {
                padding: 10px;
            }
            .notification {
                background-color: #eaffea;
                padding: 15px;
                margin: 20px 0;
                border-left: 4px solid #2ecc71;
            }
            .cta-button {
                display: inline-block;
                padding: 10px 20px;
                background-color: #3498db;
                color: white;
                text-decoration: none;
                border-radius: 5px;
                font-weight: bold;
                margin: 20px 0;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h2>Wishlist Vehicle Now Available!</h2>
            </div>
            <div class="content">
                <p>Hello ${name},</p>
                
                <div class="notification">
                    <strong>Great news!</strong> A vehicle matching your wishlist is now available.
                </div>
                
                <table>
                    <tr>
                        <th>Make</th>
                        <td>${vehicleDetails.make || 'N/A'}</td>
                    </tr>
                    <tr>
                        <th>Model</th>
                        <td>${vehicleDetails.model || 'N/A'}</td>
                    </tr>
                    <tr>
                        <th>Year</th>
                        <td>${vehicleDetails.year || 'N/A'}</td>
                    </tr>
                    ${vehicleDetails.color ? `<tr><th>Color</th><td>${vehicleDetails.color}</td></tr>` : ''}
                    ${vehicleDetails.kmRun ? `<tr><th>Total KM Run</th><td>${vehicleDetails.kmRun}</td></tr>` : ''}
                    ${vehicleDetails.fuelType ? `<tr><th>Fuel Type</th><td>${vehicleDetails.fuelType}</td></tr>` : ''}
                </table>
                
                <p>Don't wait too long - vehicles in demand often get booked quickly!</p>
                
                <div style="text-align: center;">
                    <a href="http://localhost:5173/WishlistVehicleDetail/${vehicleDetails.id}" class="cta-button">View Vehicle Now</a>
                </div>
                
                <p>Thank you for choosing Shreya Auto for your vehicle needs.</p>
                <p>Best Regards,<br>Shreya Auto Team</p>
            </div>
            <div class="footer">
                <p>This is an automated notification. Please do not reply to this email.</p>
                <p>If you no longer wish to receive these notifications, please update your preferences in your account settings.</p>
            </div>
        </div>
    </body>
    </html>`;

    const mailOptions = {
        from: `"Shreya Auto" <${process.env.EMAIL_USER}>`,
        to: recipientEmail,
        subject: 'Your Wishlist Vehicle is Now Available!',
        html: htmlContent,
        text: `Hello ${name},\n\nGreat news! A vehicle matching your wishlist is now available:\n\nMake: ${vehicleDetails.make || 'N/A'}\nModel: ${vehicleDetails.model || 'N/A'}\nYear: ${vehicleDetails.year || 'N/A'}\n${vehicleDetails.color ? `Color: ${vehicleDetails.color}\n` : ''}${vehicleDetails.kmRun ? `Total KM Run: ${vehicleDetails.kmRun}\n` : ''}${vehicleDetails.fuelType ? `Fuel Type: ${vehicleDetails.fuelType}\n` : ''}\nVisit the vehicle detail page: http://localhost:5173/WishlistVehicleDetail/${vehicleDetails.id}\n\nBest Regards,\nShreya Auto Team`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Wishlist notification sent successfully to ${recipientEmail}`);
        return true;
    } catch (error) {
        console.error('Error sending wishlist notification:', error);
        throw error;
    }
};

module.exports = sendWishlistNotification;