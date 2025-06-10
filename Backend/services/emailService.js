const nodemailer = require('nodemailer');
const crypto = require('crypto');
const dotenv = require('dotenv');
dotenv.config();

// Generate random password
const generatePassword = () => {
    return crypto.randomBytes(4).toString('hex').toUpperCase(); // 8-character password
};

// Create email transporter (Gmail configuration)
const createTransporter = () => {
    return nodemailer.createTransport({  // ← Remove 'er' from 'createTransporter'
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER, // Your Gmail address
            pass: process.env.EMAIL_PASS  // Your Gmail App Password
        }
    });
};
// Send login credentials via email
const sendLoginCredentials = async (userEmail, userName, registrationNumber, role, tempPassword) => {
    try {
        console.log(`📧 Preparing to send email to: ${userEmail}`);

        // For development - still log to console
        console.log(`
🎓 ===== LOGIN CREDENTIALS =====
👤 Name: ${userName}
📧 Email: ${userEmail}
🆔 University ID: ${registrationNumber}
👨‍🎓 Role: ${role}
🔑 Password: ${tempPassword}
🌐 Login URL: ${process.env.URL}
===============================
        `);

        // Check if email credentials are configured
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.log(`⚠️ Email credentials not configured - skipping email send`);
            console.log(`📧 Would have sent to: ${userEmail}`);
            return Promise.resolve(); // Still succeed for development
        }

        // Create transporter
        const transporter = createTransporter();

        // Verify connection
        await transporter.verify();
        console.log(`✅ SMTP connection verified`);

        // Prepare email content
        const mailOptions = {
            from: {
                name: 'Automatic Attendance System',
                address: process.env.EMAIL_USER
            },
            to: userEmail,
            subject: '🎓 Login Credentials - Automatic Attendance System',
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
                <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #2563eb; margin: 0; font-size: 28px;">🎓 Welcome to Automatic Attendance System</h1>
                        <p style="color: #6b7280; margin: 10px 0 0 0; font-size: 16px;">Your account has been approved!</p>
                    </div>

                    <!-- Greeting -->
                    <div style="margin-bottom: 25px;">
                        <h2 style="color: #374151; margin: 0 0 10px 0; font-size: 20px;">Hello ${userName}! 👋</h2>
                        <p style="color: #6b7280; margin: 0; line-height: 1.6;">
                            Congratulations! Your enrollment request has been approved. Below are your login credentials to access the Automatic Attendance System.
                        </p>
                    </div>

                    <!-- Credentials Box -->
                    <div style="background-color: #f3f4f6; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #2563eb;">
                        <h3 style="color: #374151; margin: 0 0 15px 0; font-size: 18px;">🔑 Your Login Credentials</h3>
                        
                        <div style="margin-bottom: 12px;">
                            <strong style="color: #374151;">🆔 University ID:</strong>
                            <span style="background-color: #dbeafe; padding: 4px 8px; border-radius: 4px; font-family: monospace; color: #1e40af; margin-left: 10px;">${registrationNumber}</span>
                        </div>
                        
                        <div style="margin-bottom: 12px;">
                            <strong style="color: #374151;">🔑 Password:</strong>
                            <span style="background-color: #fee2e2; padding: 4px 8px; border-radius: 4px; font-family: monospace; color: #dc2626; margin-left: 10px;">${tempPassword}</span>
                        </div>
                        
                        <div style="margin-bottom: 12px;">
                            <strong style="color: #374151;">👨‍🎓 Role:</strong>
                            <span style="background-color: #ecfdf5; padding: 4px 8px; border-radius: 4px; color: #065f46; margin-left: 10px; text-transform: capitalize;">${role}</span>
                        </div>
                    </div>

                    <!-- Login Button -->
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="https://an-automatic-attendance-system-using.onrender.com" 
                           style="background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                            🚀 Login to System
                        </a>
                    </div>

                    <!-- Important Notes -->
                    <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #f59e0b;">
                        <h4 style="color: #92400e; margin: 0 0 10px 0; font-size: 16px;">⚠️ Important Security Notes:</h4>
                        <ul style="color: #92400e; margin: 0; padding-left: 20px; line-height: 1.6;">
                            <li>Keep your credentials secure and don't share them</li>
                            <li>Use your University ID as username to login</li>
                            <li>Contact support if you face any login issues</li>
                        </ul>
                    </div>

                    <!-- Footer -->
                    <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                        <p style="color: #9ca3af; margin: 0; font-size: 14px;">
                            If you have any questions, please contact the system administrator.
                        </p>
                        <p style="color: #9ca3af; margin: 5px 0 0 0; font-size: 12px;">
                            © ${new Date().getFullYear()} Automatic Attendance System. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
            `
        };

        // Send email
        console.log(`📤 Sending email to ${userEmail}...`);
        const info = await transporter.sendMail(mailOptions);
        
        console.log(`✅ Email sent successfully!`);
        console.log(`📧 Message ID: ${info.messageId}`);
        console.log(`📬 Recipient: ${userEmail}`);
        
        return info;

    } catch (error) {
        console.error('❌ Error sending email:', error);
        
        // Don't throw error - still allow process to continue
        console.log(`⚠️ Email failed but process continues...`);
        console.log(`📧 Failed recipient: ${userEmail}`);
        
        // In development, we continue without email
        if (process.env.NODE_ENV !== 'production') {
            console.log(`🔄 Development mode - continuing without email`);
            return Promise.resolve();
        }
        
        throw error; // Only throw in production
    }
};
// Send password reset email
const sendPasswordResetEmail = async (userEmail, userName, registrationNumber, role, newPassword) => {
    try {
        console.log(`📧 Preparing to send password reset email to: ${userEmail}`);

        // Console log for development
        console.log(`
🔄 ===== PASSWORD RESET =====
👤 Name: ${userName}
📧 Email: ${userEmail}
🆔 University ID: ${registrationNumber}
👨‍🎓 Role: ${role}
🔑 New Password: ${newPassword}
🌐 Login URL: ${process.env.URL}
============================
        `);

        // Check if email credentials are configured
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.log(`⚠️ Email credentials not configured - skipping email send`);
            return Promise.resolve();
        }

        const transporter = createTransporter();
        await transporter.verify();
        console.log(`✅ SMTP connection verified for password reset`);

        const mailOptions = {
            from: {
                name: 'Automatic Attendance System',
                address: process.env.EMAIL_USER
            },
            to: userEmail,
            subject: '🔄 Password Reset - Automatic Attendance System',
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
                <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #f59e0b; margin: 0; font-size: 28px;">🔄 Password Reset Successful</h1>
                        <p style="color: #6b7280; margin: 10px 0 0 0; font-size: 16px;">Your new login credentials are ready!</p>
                    </div>

                    <!-- Greeting -->
                    <div style="margin-bottom: 25px;">
                        <h2 style="color: #374151; margin: 0 0 10px 0; font-size: 20px;">Hello ${userName}! 👋</h2>
                        <p style="color: #6b7280; margin: 0; line-height: 1.6;">
                            Your password has been successfully reset. Below are your new login credentials for the Automatic Attendance System.
                        </p>
                    </div>

                    <!-- New Credentials Box -->
                    <div style="background-color: #fef3c7; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #f59e0b;">
                        <h3 style="color: #92400e; margin: 0 0 15px 0; font-size: 18px;">🔑 Your New Login Credentials</h3>
                        
                        <div style="margin-bottom: 12px;">
                            <strong style="color: #92400e;">🆔 University ID:</strong>
                            <span style="background-color: #dbeafe; padding: 4px 8px; border-radius: 4px; font-family: monospace; color: #1e40af; margin-left: 10px;">${registrationNumber}</span>
                        </div>
                        
                        <div style="margin-bottom: 12px;">
                            <strong style="color: #92400e;">🔑 New Password:</strong>
                            <span style="background-color: #fee2e2; padding: 4px 8px; border-radius: 4px; font-family: monospace; color: #dc2626; margin-left: 10px;">${newPassword}</span>
                        </div>
                        
                        <div style="margin-bottom: 12px;">
                            <strong style="color: #92400e;">👨‍🎓 Role:</strong>
                            <span style="background-color: #ecfdf5; padding: 4px 8px; border-radius: 4px; color: #065f46; margin-left: 10px; text-transform: capitalize;">${role}</span>
                        </div>
                    </div>

                    <!-- Login Button -->
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="https://an-automatic-attendance-system-using.onrender.com" 
                           style="background-color: #f59e0b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                            🚀 Login with New Password
                        </a>
                    </div>

                    <!-- Security Notes -->
                    <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #ef4444;">
                        <h4 style="color: #dc2626; margin: 0 0 10px 0; font-size: 16px;">🔒 Important Security Notes:</h4>
                        <ul style="color: #dc2626; margin: 0; padding-left: 20px; line-height: 1.6;">
                            <li>This password was generated due to a reset request</li>
                            <li>Keep your credentials secure and don't share them</li>
                            <li>If you didn't request this reset, contact support immediately</li>
                        </ul>
                    </div>

                    <!-- Footer -->
                    <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                        <p style="color: #9ca3af; margin: 0; font-size: 14px;">
                            If you didn't request this password reset, please contact the system administrator immediately.
                        </p>
                        <p style="color: #9ca3af; margin: 5px 0 0 0; font-size: 12px;">
                            © ${new Date().getFullYear()} Automatic Attendance System. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Password reset email sent successfully!`);
        console.log(`📧 Message ID: ${info.messageId}`);
        
        return info;

    } catch (error) {
        console.error('❌ Error sending password reset email:', error);
        
        if (process.env.NODE_ENV !== 'production') {
            console.log(`🔄 Development mode - continuing without email`);
            return Promise.resolve();
        }
        
        throw error;
    }
};

// Export the new function
module.exports = {
    generatePassword,
    sendLoginCredentials,
    sendPasswordResetEmail  // Add this export
};