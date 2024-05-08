const nodemailer = require('nodemailer');
require('dotenv').config(); 

async function sendEmail(email, password) {
    let transporter = nodemailer.createTransport({
        host: 'smtp.example.com', 
        port: 587, 
        secure: false, 
        auth: {
            user: process.env.DB_MAIL_FROM,
            pass: process.env.DB_MAIL_PASS
        }
    });

    const htmlContent = `
        <p>Hello,</p>
        <p>Your password is: <strong>${password}</strong></p>
        <p>Thank you!</p>
    `;

    let info = await transporter.sendMail({
        from: '"Your Name" <your_email@example.com>',
        to: email, 
        subject: 'Your Password', 
        html: htmlContent 
    });

    console.log('Message sent: %s', info.messageId);
}

module.exports= {
    sendEmail
}
