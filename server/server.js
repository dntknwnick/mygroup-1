import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection } from './config/db.js';

// Import routes
import userRoutes from './routes/users.routes.js';
import locationRoutes from './routes/locations.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increased limit for image uploads
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const dbConnected = await testConnection();
    res.json({ 
      success: true, 
      message: 'API is running',
      database: dbConnected ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      success: false,
      message: 'Health check failed',
      error: error.message
    });
  }
});

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', userRoutes); // For backward compatibility with login
app.use('/api', locationRoutes);

// API Documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'My Group API Server',
    version: '1.0.0',
    endpoints: {
      health: 'GET /api/health',
      auth: {
        login: 'POST /api/auth/login'
      },
      users: {
        create: 'POST /api/users',
        getAll: 'GET /api/users',
        getById: 'GET /api/users/:userId',
        updateDetails: 'PUT /api/users/update-details',
        updateStatus: 'PUT /api/users/:userId/status',
        delete: 'DELETE /api/users/:userId',
        getByCreator: 'GET /api/users/creator/:creatorId',
        changePassword: 'PUT /api/users/:userId/change-password'
      },
      locations: {
        continents: {
          getAll: 'GET /api/continents',
          create: 'POST /api/continents',
          update: 'PUT /api/continents/:continentId',
          delete: 'DELETE /api/continents/:continentId'
        },
        countries: {
          getAll: 'GET /api/countries',
          getById: 'GET /api/countries/:countryId',
          create: 'POST /api/countries',
          update: 'PUT /api/countries/:countryId',
          delete: 'DELETE /api/countries/:countryId'
        },
        states: {
          getByCountry: 'GET /api/countries/:countryId/states'
        },
        districts: {
          getByState: 'GET /api/states/:stateId/districts'
        },
        hierarchy: 'GET /api/hierarchy'
      }
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).json({ 
    success: false, 
    error: 'Something went wrong!',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    error: 'Endpoint not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Start server
const startServer = async () => {
  try {
    // Test database connection
    const dbConnected = await testConnection();
    if (!dbConnected) {
      console.error('❌ Failed to connect to database. Server will not start.');
      process.exit(1);
    }

    // Start the server
    app.listen(PORT, () => {
      console.log('🚀 ================================');
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🚀 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🚀 Health check: http://localhost:${PORT}/api/health`);
      console.log(`🚀 API docs: http://localhost:${PORT}/api`);
      console.log('🚀 ================================');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🔄 SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🔄 SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the server
startServer();
