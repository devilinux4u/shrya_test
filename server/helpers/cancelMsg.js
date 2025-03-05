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

// Function to send cancellation notification emails with HTML table formatting
const cancelEmail = async (msg, data, admin) => {
    console.log(data);
    
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
    
    // Create HTML content with table layout
    const createEmailContent = (recipient, vehicleInfo, dateInfo, reason) => {
        return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Rental Cancellation</title>
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
                    background-color: #f8f8f8;
                    padding: 20px;
                    text-align: center;
                    border-bottom: 3px solid #ddd;
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
                }
                td {
                    padding: 10px;
                }
                .reason {
                    background-color: #fff7f7;
                    padding: 15px;
                    margin: 20px 0;
                    border-left: 4px solid #ff6b6b;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h2>Rental Cancellation Notification</h2>
                </div>
                <div class="content">
                    <p>Dear ${recipient},</p>
                    <p>This is to confirm that the following vehicle rental has been canceled:</p>
                    
                    <table>
                        <tr>
                            <th>Vehicle</th>
                            <td>${vehicleInfo}</td>
                        </tr>
                        <tr>
                            <th>Scheduled Pickup</th>
                            <td>${dateInfo}</td>
                        </tr>
                    </table>
                    
                    <div class="reason">
                        <strong>Cancellation Reason:</strong>
                        <p>${reason || 'No reason provided'}</p>
                    </div>
                    
                    <p>If you have any questions regarding this cancellation, please contact our customer support.</p>
                    <p>Thank you for your understanding.</p>
                </div>
                <div class="footer">
                    <p>This is an automated notification. Please do not reply to this email.</p>
                </div>
            </div>
        </body>
        </html>`;
    };

    let mailOptions;
    
    if (admin === false) {
        const userName = data.User?.fname || "Unknown User";
        const vehicleInfo = `${data.RentalVehicle.make} ${data.RentalVehicle.model} ${data.RentalVehicle.year}`;
        const dateInfo = formatDateTime(data.pickupDate);
        
        mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_ADMIN,
            subject: 'Rental Cancellation Notification',
            html: createEmailContent("Admin", vehicleInfo, dateInfo, 
                `${userName} has canceled their reservation. ${msg ? "Reason: " + msg : ""}`),
            text: `Dear Admin, \n\n ${userName} canceled ${vehicleInfo} rental vehicle booking for ${dateInfo}. \n\n Reason: ${msg ? msg : 'none'}`
        };
    } else if (admin === true) {
        const userName = data.user?.fname || "Customer";
        const vehicleInfo = `${data.RentalVehicle.make} ${data.RentalVehicle.model} ${data.RentalVehicle.year}`;
        const dateInfo = formatDateTime(data.pickupDate);
        
        mailOptions = {
            from: process.env.EMAIL_USER,
            to: data.user?.email,
            subject: 'Rental Cancellation Notification',
            html: createEmailContent(userName, vehicleInfo, dateInfo, msg),
            text: `Dear ${userName}, \n\n Your booking for ${vehicleInfo} rental vehicle on ${dateInfo} has been canceled. \n\n Reason: ${msg ? msg : 'none'}`
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