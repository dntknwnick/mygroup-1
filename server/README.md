# My Group API Server

A modular Node.js/Express API server following MVC architecture for the My Group application.

## 📁 Project Structure

```
/server
├── package.json              # Dependencies and scripts
├── server.js                 # Entry point
├── .env                      # Environment variables
├── config/
│   └── db.js                 # Database connection configuration
├── routes/
│   ├── users.routes.js       # User-related routes
│   └── locations.routes.js   # Location-related routes
├── controllers/
│   ├── users.controller.js   # User business logic
│   └── locations.controller.js # Location business logic
├── models/
│   ├── users.model.js        # User data access layer
│   └── locations.model.js    # Location data access layer
└── README.md                 # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   cd server
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. **Start the server:**
   ```bash
   npm start
   # or for development with auto-reload
   npm run dev
   ```

## 🔧 Configuration

### Environment Variables (.env)
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=my_group_db
DB_USER=postgres
DB_PASSWORD=your_password

# Server Configuration
PORT=3001
NODE_ENV=development

# Security
JWT_SECRET=your_jwt_secret_key_here
BCRYPT_ROUNDS=10
```

## 📚 API Documentation

### Base URL
```
http://localhost:3001/api
```

### Health Check
- **GET** `/api/health` - Check server and database status

### Authentication
- **POST** `/api/auth/login` - User login

### Users
- **POST** `/api/users` - Create new user
- **GET** `/api/users` - Get all users (with pagination)
- **GET** `/api/users/:userId` - Get user by ID
- **PUT** `/api/users/update-details` - Update user details
- **PUT** `/api/users/:userId/status` - Update user status
- **DELETE** `/api/users/:userId` - Delete user
- **GET** `/api/users/creator/:creatorId` - Get users by creator
- **PUT** `/api/users/:userId/change-password` - Change password

### Locations

#### Continents
- **GET** `/api/continents` - Get all continents
- **POST** `/api/continents` - Create continent
- **PUT** `/api/continents/:continentId` - Update continent
- **DELETE** `/api/continents/:continentId` - Delete continent

#### Countries
- **GET** `/api/countries` - Get all countries
- **GET** `/api/countries/:countryId` - Get country by ID
- **POST** `/api/countries` - Create country
- **PUT** `/api/countries/:countryId` - Update country
- **DELETE** `/api/countries/:countryId` - Delete country

#### States (Future)
- **GET** `/api/countries/:countryId/states` - Get states by country

#### Districts (Future)
- **GET** `/api/states/:stateId/districts` - Get districts by state

#### Utility
- **GET** `/api/hierarchy` - Get complete location hierarchy

## 🏗️ Architecture

### MVC Pattern
The application follows the Model-View-Controller (MVC) architectural pattern:

- **Models**: Handle data access and business logic
- **Controllers**: Handle HTTP requests and responses
- **Routes**: Define API endpoints and route to controllers

### Database Layer
- **PostgreSQL** with connection pooling
- **UUID** primary keys for all tables
- **Transactions** for data consistency
- **Indexes** for performance optimization

### Error Handling
- Centralized error handling middleware
- Structured error responses
- Logging for debugging and monitoring

## 🔒 Security Features

- **CORS** enabled for cross-origin requests
- **Input validation** on all endpoints
- **Password hashing** with bcrypt
- **SQL injection prevention** with parameterized queries
- **Error message sanitization**

## 📊 Database Schema

### Core Tables
- `my_group_app` - Applications
- `my_group_user` - Users
- `my_group_user_details` - User profile details
- `my_group_member` - Member groups
- `my_group_user_group` - User-group relationships

### Location Tables
- `continents` - Geographical continents
- `countries` - Countries within continents
- `states` - States/provinces within countries
- `districts` - Districts within states

## 🧪 Testing

### Manual Testing
Use the health check endpoint to verify the server is running:
```bash
curl http://localhost:3001/api/health
```

### API Testing
Use tools like Postman, Insomnia, or curl to test endpoints:
```bash
# Login example
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password123"}'

# Get countries example
curl http://localhost:3001/api/countries
```

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

### Environment Setup
1. Set `NODE_ENV=production`
2. Configure production database
3. Set secure JWT secret
4. Enable SSL for database connections

## 📝 Logging

The server includes comprehensive logging:
- Request logging for all API calls
- Error logging with stack traces
- Database connection status
- Server startup information

## 🔄 Future Enhancements

### Planned Features
- JWT authentication middleware
- Rate limiting
- API versioning
- Swagger documentation
- Unit and integration tests
- Docker containerization
- Redis caching
- File upload handling
- Email notifications

### State and District Management
The foundation is already in place for:
- State CRUD operations
- District CRUD operations
- Hierarchical location queries
- Location-based user filtering

## 🤝 Contributing

1. Follow the existing code structure
2. Add proper error handling
3. Include input validation
4. Update documentation
5. Test thoroughly before committing

## 📞 Support

For issues or questions:
1. Check the logs for error details
2. Verify database connection
3. Ensure all environment variables are set
4. Check API endpoint documentation

## 🔗 Related Files

- Frontend: `../src/components/CountryManagement.jsx`
- Database Schema: `../database/schema.sql`
- Setup Guide: `../COMPLETE_SETUP_GUIDE.md`
- Country Management Guide: `../COUNTRY_MANAGEMENT_GUIDE.md`
