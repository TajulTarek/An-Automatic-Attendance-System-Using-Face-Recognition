


const express = require('express');
const router = express.Router();
// Add these imports at the top of your file
const User = require('../models/User');
const { generatePassword, sendLoginCredentials } = require('../services/emailService');
// Import the model
const EnrollmentRequest = require('../models/EnrollmentRequest');

// Test route
router.get('/test', (req, res) => {
    console.log('✅ Test route hit!');
    res.json({ 
        message: 'Enrollment routes are working!',
        timestamp: new Date().toISOString()
    });
});
// POST - Send login credentials to approved user (WITH DETAILED DEBUGGING)
router.post('/:id/send-credentials', async (req, res) => {
    try {
        const { id } = req.params;
        const { email, name } = req.body;

        console.log(`\n🚀 ===== STARTING USER CREATION PROCESS =====`);
        console.log(`📧 Email: ${email}`);
        console.log(`👤 Name: ${name}`);
        console.log(`🆔 Enrollment ID: ${id}`);

        // Find the enrollment request
        console.log(`\n🔍 Step 1: Finding enrollment request...`);
        const enrollmentRequest = await EnrollmentRequest.findById(id);
        
        if (!enrollmentRequest) {
            console.log(`❌ Enrollment request not found for ID: ${id}`);
            return res.status(404).json({
                success: false,
                message: 'Enrollment request not found'
            });
        }

        console.log(`✅ Found enrollment request:`, {
            name: enrollmentRequest.name,
            email: enrollmentRequest.email,
            registrationNumber: enrollmentRequest.registrationNumber,
            role: enrollmentRequest.role,
            status: enrollmentRequest.status
        });

        // Check if request is approved
        if (enrollmentRequest.status !== 'approved') {
            console.log(`❌ Request not approved - Status: ${enrollmentRequest.status}`);
            return res.status(400).json({
                success: false,
                message: 'Only approved requests can receive credentials'
            });
        }

        // Generate temporary password
        console.log(`\n🔑 Step 2: Generating password...`);
        const tempPassword = generatePassword();
        console.log(`✅ Generated password: ${tempPassword}`);

        // Check if user already exists
        console.log(`\n👤 Step 3: Checking if user exists...`);
        let existingUser = await User.findOne({ 
            $or: [
                { email: enrollmentRequest.email.toLowerCase() },
                { uni_id: enrollmentRequest.registrationNumber }
            ]
        });

        console.log(`🔍 User lookup result:`, existingUser ? 'FOUND EXISTING USER' : 'NO EXISTING USER');

        let user;
        let userAction;

        if (existingUser) {
            // Update existing user
            console.log(`\n🔄 Step 4a: Updating existing user...`);
            existingUser.password = tempPassword;
            existingUser.isPasswordChanged = false;
            existingUser.isActive = true;
            existingUser.enrollmentRequestId = enrollmentRequest._id;
            
            user = await existingUser.save();
            userAction = 'UPDATED';
            console.log(`✅ Updated existing user:`, user._id);
        } else {
            // Create new user
            console.log(`\n👤 Step 4b: Creating new user...`);
            
            const newUserData = {
                name: enrollmentRequest.name,
                email: enrollmentRequest.email.toLowerCase(),
                password: tempPassword,
                role: enrollmentRequest.role === 'student' ? 'Student' : 'Teacher',
                uni_id: enrollmentRequest.registrationNumber,
                courses_enrolled: [],
                photoCnt: 0,
                isPasswordChanged: false,
                isActive: true,
                enrollmentRequestId: enrollmentRequest._id
            };

            console.log(`📝 New user data to create:`, newUserData);

            user = new User(newUserData);
            const savedUser = await user.save();
            userAction = 'CREATED';
            
            console.log(`✅ NEW USER CREATED SUCCESSFULLY!`);
            console.log(`🆔 User ID: ${savedUser._id}`);
            console.log(`📧 Email: ${savedUser.email}`);
            console.log(`🎓 Uni ID: ${savedUser.uni_id}`);
            console.log(`👨‍🎓 Role: ${savedUser.role}`);
        }

        // Verify user was saved
        console.log(`\n✅ Step 5: Verifying user in database...`);
        const verifyUser = await User.findById(user._id);
        console.log(`🔍 Verification result:`, verifyUser ? 'USER FOUND IN DB ✅' : 'USER NOT FOUND IN DB ❌');

        // Send credentials
        console.log(`\n📧 Step 6: Sending credentials...`);
        await sendLoginCredentials(
            enrollmentRequest.email,
            enrollmentRequest.name,
            enrollmentRequest.registrationNumber,
            enrollmentRequest.role,
            tempPassword
        );

        console.log(`✅ Email service completed`);

        // Send response
        res.json({
            success: true,
            message: `Login credentials sent successfully to ${email}`,
            data: {
                email: email,
                uni_id: enrollmentRequest.registrationNumber,
                password: tempPassword,
                role: enrollmentRequest.role,
                name: enrollmentRequest.name,
                userAction: userAction,
                userId: user._id
            }
        });

        console.log(`\n🎉 ===== PROCESS COMPLETED SUCCESSFULLY =====`);
        console.log(`👤 User ${userAction}: ${user.email}`);
        console.log(`🆔 Database ID: ${user._id}`);
        console.log(`=============================================\n`);

    } catch (error) {
        console.log(`\n💥 ===== ERROR OCCURRED =====`);
        console.error('❌ Full error:', error);
        console.log(`📧 Email: ${email}`);
        console.log(`🆔 Enrollment ID: ${id}`);
        console.log(`🕐 Time: ${new Date().toLocaleString()}`);
        
        if (error.code === 11000) {
            console.log(`🔴 DUPLICATE KEY ERROR - User already exists`);
            return res.status(400).json({
                success: false,
                message: 'User account already exists with this email or university ID'
            });
        }
        
        console.log(`🔴 Error code:`, error.code);
        console.log(`🔴 Error name:`, error.name);
        console.log(`🔴 Error message:`, error.message);
        console.log(`============================\n`);
        
        res.status(500).json({
            success: false,
            message: 'Error sending login credentials',
            error: error.message
        });
    }
});

// POST - Send login credentials to approved user (NO USER CREATION)
// router.post('/:id/send-credentials', async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { email, name } = req.body;

//         console.log(`📧 Sending credentials for enrollment ${id} to ${email}`);

//         // Find the enrollment request
//         const enrollmentRequest = await EnrollmentRequest.findById(id);
//         if (!enrollmentRequest) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Enrollment request not found'
//             });
//         }

//         // Check if request is approved
//         if (enrollmentRequest.status !== 'approved') {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Only approved requests can receive credentials'
//             });
//         }

//         // Generate temporary password
//         const tempPassword = generatePassword();

//         // Just send credentials - NO USER CREATION
//         await sendLoginCredentials(
//             enrollmentRequest.email,
//             enrollmentRequest.name,
//             enrollmentRequest.registrationNumber,
//             enrollmentRequest.role,
//             tempPassword
//         );

//         console.log(`✅ Credentials sent to ${email} - Password: ${tempPassword}`);

//         res.json({
//             success: true,
//             message: `Login credentials sent successfully to ${email}`,
//             data: {
//                 email: email,
//                 uni_id: enrollmentRequest.registrationNumber,
//                 password: tempPassword, // Return password for testing
//                 role: enrollmentRequest.role
//             }
//         });

//     } catch (error) {
//         console.error('❌ Error sending credentials:', error);
        
//         res.status(500).json({
//             success: false,
//             message: 'Error sending login credentials',
//             error: error.message
//         });
//     }
// });
// POST - Submit enrollment request
router.post('/submit', async (req, res) => {
    try {
        console.log('📝 Enrollment request received:', req.body);

        const { name, registrationNumber, email, role, idCardImage } = req.body;

        // Validate required fields
        if (!name || !registrationNumber || !email || !role || !idCardImage) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required',
                received: { 
                    name: !!name, 
                    registrationNumber: !!registrationNumber, 
                    email: !!email, 
                    role: !!role, 
                    idCardImage: !!idCardImage 
                }
            });
        }

        // Check if request already exists
        const existingRequest = await EnrollmentRequest.findOne({
            $or: [
                { email: email.toLowerCase() },
                { registrationNumber: registrationNumber }
            ]
        });

        if (existingRequest) {
            return res.status(400).json({
                success: false,
                message: 'Enrollment request already exists for this email or registration number'
            });
        }

        // Create new enrollment request
        const enrollmentRequest = new EnrollmentRequest({
            name: name.trim(),
            registrationNumber: registrationNumber.trim(),
            email: email.toLowerCase().trim(),
            role: role,
            idCardImage: idCardImage
        });

        // Save to database
        const savedRequest = await enrollmentRequest.save();

        console.log('✅ Enrollment request saved:', savedRequest._id);

        res.status(201).json({
            success: true,
            message: 'Enrollment request submitted successfully',
            data: {
                requestId: savedRequest._id,
                name: savedRequest.name,
                email: savedRequest.email,
                status: savedRequest.status
            }
        });

    } catch (error) {
        console.error('❌ Error submitting enrollment request:', error);

        // Handle duplicate key errors
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Email or registration number already exists'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});


// Remove this import
// const bcrypt = require('bcryptjs');

// Update the send-credentials route:

// GET - Get all enrollment requests
router.get('/all', async (req, res) => {
    try {
        console.log('📋 Fetching all enrollment requests...');
        
        const requests = await EnrollmentRequest.find().sort({ submittedAt: -1 });
        console.log(`📋 Found ${requests.length} total enrollment requests`);
        
        res.json({
            success: true,
            count: requests.length,
            data: requests
        });
    } catch (error) {
        console.error('❌ Error fetching all requests:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching enrollment requests'
        });
    }
});

// GET - Get pending requests
router.get('/pending', async (req, res) => {
    try {
        console.log('⏳ Fetching pending enrollment requests...');
        
        const requests = await EnrollmentRequest.find({ status: 'pending' })
            .sort({ submittedAt: -1 });

        console.log(`⏳ Found ${requests.length} pending enrollment requests`);

        res.json({
            success: true,
            count: requests.length,
            data: requests
        });
    } catch (error) {
        console.error('❌ Error fetching pending requests:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching pending requests'
        });
    }
});

// GET - Get approved requests
router.get('/approved', async (req, res) => {
    try {
        console.log('✅ Fetching approved enrollment requests...');
        
        const requests = await EnrollmentRequest.find({ status: 'approved' })
            .sort({ reviewedAt: -1 });

        console.log(`✅ Found ${requests.length} approved enrollment requests`);

        res.json({
            success: true,
            count: requests.length,
            data: requests
        });
    } catch (error) {
        console.error('❌ Error fetching approved requests:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching approved requests'
        });
    }
});

// GET - Get rejected requests
router.get('/rejected', async (req, res) => {
    try {
        console.log('❌ Fetching rejected enrollment requests...');
        
        const requests = await EnrollmentRequest.find({ status: 'rejected' })
            .sort({ reviewedAt: -1 });

        console.log(`❌ Found ${requests.length} rejected enrollment requests`);

        res.json({
            success: true,
            count: requests.length,
            data: requests
        });
    } catch (error) {
        console.error('❌ Error fetching rejected requests:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching rejected requests'
        });
    }
});

// PUT - Review enrollment request (approve/reject)
router.put('/:id/review', async (req, res) => {
    try {
        const { id } = req.params;
        const { status, rejectionReason } = req.body;

        console.log(`🔍 Reviewing enrollment ${id} with status: ${status}`);
        console.log(`📝 Rejection reason: ${rejectionReason || 'None provided'}`);

        // Validate status
        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Must be approved or rejected.'
            });
        }

        // Find the enrollment request
        const enrollmentRequest = await EnrollmentRequest.findById(id);
        if (!enrollmentRequest) {
            return res.status(404).json({
                success: false,
                message: 'Enrollment request not found'
            });
        }

        // Check if already reviewed
        if (enrollmentRequest.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: `Request has already been ${enrollmentRequest.status}`
            });
        }

        // Prepare update data
        const updateData = {
            status: status,
            reviewedAt: new Date()
        };

        // Add rejection reason if provided and status is rejected
        if (status === 'rejected' && rejectionReason && rejectionReason.trim()) {
            updateData.rejectionReason = rejectionReason.trim();
        }

        // Update the enrollment request
        const updatedRequest = await EnrollmentRequest.findByIdAndUpdate(
            id,
            updateData,
            { new: true } // Return the updated document
        );

        console.log(`✅ Enrollment ${id} ${status} successfully`);

        res.json({
            success: true,
            message: `Enrollment request ${status} successfully`,
            data: updatedRequest
        });

    } catch (error) {
        console.error('❌ Error reviewing request:', error);
        res.status(500).json({
            success: false,
            message: 'Error reviewing enrollment request',
            error: error.message
        });
    }
});

// GET - Get enrollment request by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        console.log(`🔍 Fetching enrollment request: ${id}`);
        
        const request = await EnrollmentRequest.findById(id);

        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Enrollment request not found'
            });
        }

        console.log(`✅ Found enrollment request: ${request.name} (${request.email})`);

        res.json({
            success: true,
            data: request
        });
    } catch (error) {
        console.error('❌ Error fetching request:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching enrollment request'
        });
    }
});

// DELETE - Delete enrollment request (optional admin feature)
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        console.log(`🗑️ Deleting enrollment request: ${id}`);
        
        const deletedRequest = await EnrollmentRequest.findByIdAndDelete(id);

        if (!deletedRequest) {
            return res.status(404).json({
                success: false,
                message: 'Enrollment request not found'
            });
        }

        console.log(`✅ Deleted enrollment request: ${deletedRequest.name} (${deletedRequest.email})`);

        res.json({
            success: true,
            message: 'Enrollment request deleted successfully',
            data: deletedRequest
        });
    } catch (error) {
        console.error('❌ Error deleting request:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting enrollment request'
        });
    }
});

// GET - Get statistics
router.get('/stats/summary', async (req, res) => {
    try {
        console.log('📊 Fetching enrollment statistics...');
        
        const [
            totalRequests,
            pendingRequests,
            approvedRequests,
            rejectedRequests
        ] = await Promise.all([
            EnrollmentRequest.countDocuments(),
            EnrollmentRequest.countDocuments({ status: 'pending' }),
            EnrollmentRequest.countDocuments({ status: 'approved' }),
            EnrollmentRequest.countDocuments({ status: 'rejected' })
        ]);

        const stats = {
            total: totalRequests,
            pending: pendingRequests,
            approved: approvedRequests,
            rejected: rejectedRequests
        };

        console.log('📊 Statistics:', stats);

        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('❌ Error fetching statistics:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching statistics'
        });
    }
});

console.log('📋 Enrollment routes module loaded');

module.exports = router;