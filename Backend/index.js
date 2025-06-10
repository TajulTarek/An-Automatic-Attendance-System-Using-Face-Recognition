

// const express = require('express');
// const mongoose = require('mongoose');
// const dotenv = require('dotenv');
// const bodyParser = require("body-parser");
// const path = require('path');
// const cors = require('cors');

// dotenv.config();

// const app = express();

// // Middleware
// app.use(bodyParser.json({ limit: "50mb" }));
// app.use(express.static("uploads"));
// app.use(cors({
//     origin: '*',
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//     credentials: false
// }));
// app.use(express.json());

// // Import routes
// const userRoutes = require('./routes/userRoutes');
// const courseRoutes = require('./routes/courseRoutes');
// const teacherRoutes = require('./routes/teacherRoutes');
// const modelRoutes = require('./routes/modelRoutes');
// const studentPhotoRoutes = require('./routes/studentPhotoRoutes');
// const enrollmentRoutes = require('./routes/enrollmentRoutes');

// // Routes
// app.use('/reports', express.static(path.join(__dirname, 'reports')));

// // API Routes
// app.use('/api/users', userRoutes);
// app.use('/api/courses', courseRoutes);
// app.use('/api/teachers', teacherRoutes);
// app.use('/api/models', modelRoutes);
// app.use('/api/student-photos', studentPhotoRoutes);
// app.use('/api/enrollment', enrollmentRoutes);

// // Legacy routes
// app.use('/users', userRoutes);
// app.use('/courses', courseRoutes);
// app.use('/teachers', teacherRoutes);
// app.use('/models', modelRoutes);
// app.use('/student-photos', studentPhotoRoutes);

// // MongoDB connection
// mongoose.connect(process.env.MONGO_URI)
//     .then(() => console.log('✅ MongoDB connected successfully'))
//     .catch((error) => console.error('❌ MongoDB connection error:', error));

// // Default route
// app.get('/', (req, res) => {
//     res.json({ 
//         message: 'Attendance System API is running!',
//         endpoints: {
//             enrollment: '/api/enrollment',
//             test: '/api/enrollment/test'
//         }
//     });
// });

// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//     console.log(`🚀 Server running on port ${PORT}`);
//     console.log(`🧪 Test: http://localhost:${PORT}/api/enrollment/test`);
// });
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require("body-parser");
const path = require('path');
const cors = require('cors');

dotenv.config();

const app = express();

// Middleware
app.use(bodyParser.json({ limit: "50mb" }));
app.use(express.static("uploads"));
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false
}));
app.use(express.json());

// Import routes
const userRoutes = require('./routes/userRoutes');
const courseRoutes = require('./routes/courseRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const modelRoutes = require('./routes/modelRoutes');
const studentPhotoRoutes = require('./routes/studentPhotoRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');

// Routes
app.use('/reports', express.static(path.join(__dirname, 'reports')));

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/models', modelRoutes);
app.use('/api/student-photos', studentPhotoRoutes);
app.use('/api/enrollment', enrollmentRoutes);

// Legacy routes
app.use('/users', userRoutes);
app.use('/courses', courseRoutes);
app.use('/teachers', teacherRoutes);
app.use('/models', modelRoutes);
app.use('/student-photos', studentPhotoRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('✅ MongoDB connected successfully');
        console.log(`📊 Database: ${mongoose.connection.name}`);
        console.log(`🌐 Host: ${mongoose.connection.host}:${mongoose.connection.port}`);
    })
    .catch((error) => {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    });

// MongoDB connection events
mongoose.connection.on('connected', () => {
    console.log('🟢 Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.error('🔴 Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('🟡 Mongoose disconnected');
});

// Test route
app.get('/api/test', (req, res) => {
    res.json({ 
        message: 'Backend API is working!', 
        timestamp: new Date(),
        mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
        database: mongoose.connection.name
    });
});

// Health check route
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        uptime: process.uptime(),
        timestamp: new Date(),
        mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
    });
});

// Default route
app.get('/', (req, res) => {
    res.json({ 
        message: 'Attendance System API is running!',
        version: '1.0.0',
        endpoints: {
            enrollment: {
                all: '/api/enrollment/all',
                pending: '/api/enrollment/pending',
                approved: '/api/enrollment/approved',
                rejected: '/api/enrollment/rejected',
                test: '/api/enrollment/test',
                submit: '/api/enrollment/submit',
                review: '/api/enrollment/:id/review'
            },
            users: '/api/users',
            courses: '/api/courses',
            teachers: '/api/teachers',
            models: '/api/models',
            studentPhotos: '/api/student-photos',
            test: '/api/test',
            health: '/health'
        },
        mongodb: {
            status: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
            database: mongoose.connection.name || 'Not connected'
        }
    });
});

// 404 handler for unknown routes
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
        availableEndpoints: [
            '/api/enrollment',
            '/api/users', 
            '/api/courses',
            '/api/teachers',
            '/api/models',
            '/api/student-photos',
            '/api/test',
            '/health'
        ]
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('❌ Global error handler:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    const BASE_URL = process.env.URL || `http://localhost:${PORT}`;

    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌐 API URL: ${BASE_URL}`);
    console.log(`🧪 Test API: ${BASE_URL}/api/test`);
    console.log(`📋 Enrollment API: ${BASE_URL}/api/enrollment/test`);
    console.log(`📊 Health Check: ${BASE_URL}/health`);
    console.log(`📚 All Endpoints: ${BASE_URL}/`);
});


// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n🛑 Received SIGINT. Graceful shutdown...');
    try {
        await mongoose.connection.close();
        console.log('✅ MongoDB connection closed');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error during shutdown:', error);
        process.exit(1);
    }
});

process.on('SIGTERM', async () => {
    console.log('\n🛑 Received SIGTERM. Graceful shutdown...');
    try {
        await mongoose.connection.close();
        console.log('✅ MongoDB connection closed');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error during shutdown:', error);
        process.exit(1);
    }
});