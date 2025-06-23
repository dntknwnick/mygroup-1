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

// Health check endpoint
app.get('/api/health', async (req, res) => {
  const dbConnected = await testConnection();
  res.json({ 
    success: true, 
    message: 'API is running',
    database: dbConnected ? 'connected' : 'disconnected'
  });
});

// Authentication endpoints
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Username and password are required' 
      });
    }
    
    const result = await authenticateUser(username, password);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(401).json(result);
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

// User management endpoints
app.post('/api/users', async (req, res) => {
  try {
    const userData = req.body;
    const createdBy = userData.created_by;
    
    if (!userData.username || !userData.password || !userData.role) {
      return res.status(400).json({ 
        success: false, 
        error: 'Username, password, and role are required' 
      });
    }
    
    const result = await createUser(userData, createdBy);
    
    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

app.get('/api/users/created-by/:creatorId', async (req, res) => {
  try {
    const { creatorId } = req.params;
    const users = await getUsersByCreator(creatorId);

    res.json({
      success: true,
      users
    });
  } catch (error) {
    console.error('Get users by creator error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Update user details endpoint
app.put('/api/users/update-details', async (req, res) => {
  try {
    const userDetails = req.body;

    if (!userDetails.userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    const result = await updateUserDetails(userDetails);

    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Update user details error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Location management endpoints

// Continent endpoints
app.get('/api/continents', async (req, res) => {
  try {
    const result = await getContinents();
    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    console.error('Get continents error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

app.post('/api/continents', async (req, res) => {
  try {
    const continentData = req.body;

    if (!continentData.name || !continentData.code) {
      return res.status(400).json({
        success: false,
        error: 'Name and code are required'
      });
    }

    const result = await createContinent(continentData);

    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Create continent error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Country endpoints
app.get('/api/countries', async (req, res) => {
  try {
    const result = await getCountries();
    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    console.error('Get countries error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

app.post('/api/countries', async (req, res) => {
  try {
    const countryData = req.body;

    if (!countryData.continent_id || !countryData.name || !countryData.code) {
      return res.status(400).json({
        success: false,
        error: 'Continent, name, and code are required'
      });
    }

    const result = await createCountry(countryData);

    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Create country error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

app.put('/api/countries/:id', async (req, res) => {
  try {
    const countryId = req.params.id;
    const countryData = req.body;

    if (!countryData.continent_id || !countryData.name || !countryData.code) {
      return res.status(400).json({
        success: false,
        error: 'Continent, name, and code are required'
      });
    }

    const result = await updateCountry(countryId, countryData);

    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Update country error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

app.delete('/api/countries/:id', async (req, res) => {
  try {
    const countryId = req.params.id;
    const result = await deleteCountry(countryId);

    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Delete country error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    error: 'Something went wrong!' 
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    error: 'Endpoint not found' 
  });
});

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  
  // Test database connection on startup
  const dbConnected = await testConnection();
  if (dbConnected) {
    console.log('✅ Database connection established');
  } else {
    console.log('❌ Database connection failed');
  }
});
