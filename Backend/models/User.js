// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true }, // Plaintext password
//     role: { type: String, enum: ['Admin', 'Teacher', 'Student'] },
//     uni_id: { type: String ,required:true},
//     courses_enrolled: [{ type: String }],
//     photoCnt: { type: Number, default: 0 }
// });

// module.exports = mongoose.model('User', userSchema);
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        trim: true
    },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        lowercase: true,
        trim: true
    },
    password: { 
        type: String, 
        required: true 
    },
    role: { 
        type: String, 
        enum: ['Admin', 'Teacher', 'Student'], // Keep your existing roles
        required: true
    },
    uni_id: { 
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    courses_enrolled: [{ 
        type: String 
    }],
    photoCnt: { 
        type: Number, 
        default: 0 
    },
    
    // NEW FIELDS for enrollment system
    isPasswordChanged: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastLogin: {
        type: Date
    },
    enrollmentRequestId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EnrollmentRequest'
    }
});

module.exports = mongoose.model('User', userSchema);