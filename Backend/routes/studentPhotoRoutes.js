const express = require('express');
const router = express.Router();
const StudentPhoto = require('../models/StudentPhoto');

// Route to save student photos
router.post('/upload', async (req, res) => {
    try {
        const { registrationNumber, photos } = req.body;
        console.log('\n=== New Photo Upload Request ===');
        console.log('Registration Number:', registrationNumber);
        console.log('Number of photos:', photos ? photos.length : 0);

        // Validate input
        if (!registrationNumber || !photos || !Array.isArray(photos)) {
            console.error('Validation Error:', {
                hasRegistrationNumber: !!registrationNumber,
                hasPhotos: !!photos,
                isArray: Array.isArray(photos)
            });
            return res.status(400).json({ 
                message: 'Invalid input. Registration number and photos array are required.' 
            });
        }

        // Create new student photo record
        const studentPhoto = new StudentPhoto({
            registrationNumber,
            photos
        });

        console.log('Attempting to save to database...');
        const savedPhoto = await studentPhoto.save();
        console.log('Successfully saved to database:', {
            id: savedPhoto._id,
            registrationNumber: savedPhoto.registrationNumber,
            photoCount: savedPhoto.photos.length,
            createdAt: savedPhoto.createdAt
        });

        res.status(201).json({ 
            message: 'Photos uploaded successfully',
            data: savedPhoto 
        });
    } catch (error) {
        console.error('\n=== Error in Photo Upload ===');
        console.error('Error details:', error.message);
        console.error('Stack trace:', error.stack);
        res.status(500).json({ 
            message: 'Error uploading photos', 
            error: error.message 
        });
    }
});

// Route to get photos by registration number
router.get('/:registrationNumber', async (req, res) => {
    try {
        const { registrationNumber } = req.params;
        console.log('\n=== Fetching Photos ===');
        console.log('Registration Number:', registrationNumber);

        const studentPhotos = await StudentPhoto.find({ registrationNumber })
            .sort({ createdAt: -1 });

        console.log('Found records:', studentPhotos.length);
        if (studentPhotos.length > 0) {
            console.log('Latest record:', {
                id: studentPhotos[0]._id,
                photoCount: studentPhotos[0].photos.length,
                createdAt: studentPhotos[0].createdAt
            });
        }

        res.status(200).json(studentPhotos);
    } catch (error) {
        console.error('\n=== Error Fetching Photos ===');
        console.error('Error details:', error.message);
        console.error('Stack trace:', error.stack);
        res.status(500).json({ 
            message: 'Error fetching photos', 
            error: error.message 
        });
    }
});

module.exports = router; 
