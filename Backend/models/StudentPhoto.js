const mongoose = require('mongoose');

const studentPhotoSchema = new mongoose.Schema({
    registrationNumber: { 
        type: String, 
        required: true 
    },
    photos: [{ 
        type: String, 
        required: true 
    }],
    createdAt: { 
        type: Date, 
        default: Date.now 
    } 
});

module.exports = mongoose.model('StudentPhoto', studentPhotoSchema); 
