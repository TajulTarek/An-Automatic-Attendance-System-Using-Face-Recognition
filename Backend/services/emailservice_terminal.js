const crypto = require('crypto');
const dotenv = require('dotenv');
dotenv.config();

// Generate random password
const generatePassword = () => {
    return crypto.randomBytes(4).toString('hex').toUpperCase(); // 8-character password
};

// For development - using console instead of email
const sendLoginCredentials = async (userEmail, userName, registrationNumber, role, tempPassword) => {
    try {
        // Log credentials to console (development mode)
        console.log(`
🎓 ===== LOGIN CREDENTIALS SENT =====
👤 Name: ${userName}
📧 Email: ${userEmail}
🆔 University ID: ${registrationNumber}
👨‍🎓 Role: ${role}
🔑 Password: ${tempPassword}
🌐 Login URL: ${process.env.URL}
====================================
        `);

        // Simulate successful email sending
        return Promise.resolve();
        
    } catch (error) {
        console.error('❌ Error in email service:', error);
        throw error;
    }
};

module.exports = {
    generatePassword,
    sendLoginCredentials
};