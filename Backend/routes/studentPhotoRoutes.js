const express = require('express');
const router = express.Router();
const StudentPhoto = require('../models/StudentPhoto');

// Test endpoint
router.get('/test', (req, res) => {
    console.log('Test endpoint hit');
    res.json({ message: 'Student photos endpoint is working' });
});

// Route to get all student photos and delete them
router.get('/all', async (req, res) => {
    try {
        console.log('\n=== Fetching and Deleting All Student Photos ===');
        
        // First fetch all photos
        const allPhotos = await StudentPhoto.find()
            .sort({ createdAt: -1 });

        console.log(`Found ${allPhotos.length} records`);
        
        // Format the response
        const formattedResponse = allPhotos.map(record => ({
            registrationNumber: record.registrationNumber,
            photos: record.photos,
            uploadedAt: record.createdAt
        }));

        // Delete all photos after fetching
        if (allPhotos.length > 0) {
            const deleteResult = await StudentPhoto.deleteMany({});
            console.log(`Deleted ${deleteResult.deletedCount} records`);
        }

        res.status(200).json({
            message: 'Successfully retrieved and deleted all student photos',
            count: formattedResponse.length,
            deletedCount: allPhotos.length,
            data: formattedResponse
        });
    } catch (error) {
        console.error('\n=== Error in Fetch and Delete All Photos ===');
        console.error('Error details:', error.message);
        res.status(500).json({ 
            message: 'Error processing photos', 
            error: error.message 
        });
    }
});

// Route to get photos by registration number and delete them
router.get('/:registrationNumber', async (req, res) => {
    try {
        const { registrationNumber } = req.params;
        console.log('\n=== Fetching and Deleting Photos for Student ===');
        console.log('Registration Number:', registrationNumber);

        // First fetch the photos
        const studentPhotos = await StudentPhoto.find({ registrationNumber })
            .sort({ createdAt: -1 });

        console.log('Found records:', studentPhotos.length);
        
        if (studentPhotos.length === 0) {
            return res.status(404).json({
                message: `No photos found for student ${registrationNumber}`
            });
        }

        // Format the response
        const formattedResponse = studentPhotos.map(record => ({
            registrationNumber: record.registrationNumber,
            photos: record.photos,
            uploadedAt: record.createdAt
        }));

        // Delete the photos after fetching
        const deleteResult = await StudentPhoto.deleteMany({ registrationNumber });
        console.log(`Deleted ${deleteResult.deletedCount} records for student ${registrationNumber}`);

        res.status(200).json({
            message: 'Successfully retrieved and deleted student photos',
            count: formattedResponse.length,
            deletedCount: deleteResult.deletedCount,
            data: formattedResponse
        });
    } catch (error) {
        console.error('\n=== Error in Fetch and Delete Student Photos ===');
        console.error('Error details:', error.message);
        res.status(500).json({ 
            message: 'Error processing photos', 
            error: error.message 
        });
    }
});

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

router.get('/photo_count/:studentId', async (req, res) => {
    const { studentId } = req.params;

    try {
        const user = await User.findOne({ ID: studentId }); // assuming ID is the field name

        console.log(user)

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const photoCount = user.photoCnt || 0;

        return res.json({ count: photoCount });
    } catch (error) {
        console.error('Error fetching photo count:', error);
        return res.status(500).json({ message: 'Server error' });
    }
});


module.exports = router; 
