const nodemailer = require('nodemailer');
require('dotenv').config();

const sendEmail = async (email, password) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASSWORD
        }
    });

    const htmlContent = `
        <p>Hello,</p>
        <p>Your password is: <strong>${password}</strong></p>
        <p>Thank you!</p>
    `;

    let info = await transporter.sendMail({
        from: `"Your Name" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: 'Your Password',
        html: htmlContent
    });
}

module.exports = {
    sendEmail
}
