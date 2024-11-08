import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create a transporter using SMTP settings
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // Use TLS
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Function to send an email
export const sendOtpEmail = async (to, otp) => {
    const mailOptions = {
        from: `"Hostel Buddy" <${process.env.EMAIL_USER}>`,
        to,
        subject: 'Your OTP for Issue Resolution',
        text: `Your OTP to confirm the resolution of your issue is: ${otp} `,
        html: `<p>Your OTP to confirm the resolution of your issue is: <strong>${otp}</strong>.</p><p>It expires in 10 minutes.</p>`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('OTP email sent successfully');
    } catch (error) {
        console.error('Error sending OTP email:', error);
        throw new Error('Failed to send OTP email');
    }
};
