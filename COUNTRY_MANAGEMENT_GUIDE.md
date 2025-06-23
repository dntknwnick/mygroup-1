# Country Management System

This document describes the comprehensive country management system implemented in the role-based authentication application.

## Overview

The country management system provides a complete CRUD (Create, Read, Update, Delete) interface for managing countries with their associated continents, flags, currencies, and other metadata.

## Features

### 🌍 Complete Location Hierarchy
- **Continents**: Base geographical regions
- **Countries**: Countries within continents
- **States**: States/provinces within countries (ready for future implementation)
- **Districts**: Districts within states (ready for future implementation)

### 📋 Country Form Fields
Based on your reference image, the system includes:

1. **Continent** - Dropdown selection from available continents
2. **Country** - Country name (required)
3. **Code** - Country code (e.g., IND, USA) (required)
4. **Currency** - Currency code (e.g., INR, USD)
5. **Country Flag** - Image upload for country flag
6. **ISO Code** - International dialing code (e.g., +91)
7. **Nationality** - Nationality descriptor (e.g., Indian, American)
8. **Display Order** - Sorting order for display
9. **Status** - Active/Inactive toggle

### 📊 Country List Table
The country list displays:
- Serial number
- Continent name
- Country name
- Country code
- Currency
- Country flag (image preview)
- ISO code
- Nationality
- Display order (editable)
- Status toggle (Active/Inactive)
- Action buttons (Edit/Delete)

## Database Schema

### Tables Created
```sql
-- Continents table
CREATE TABLE continents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(10) NOT NULL UNIQUE,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Countries table
CREATE TABLE countries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    continent_id UUID NOT NULL REFERENCES continents(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(10) NOT NULL UNIQUE,
    currency VARCHAR(10),
    flag_image TEXT, -- Base64 encoded flag image
    iso_code VARCHAR(10),
    nationality VARCHAR(100),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(continent_id, name)
);
```

### Sample Data Included
- 7 Continents (Asia, Europe, North America, etc.)
- 3 Sample Countries (India, Nepal, Sri Lanka)

## API Endpoints

### Continent Endpoints
- `GET /api/continents` - Get all continents
- `POST /api/continents` - Create new continent

### Country Endpoints
- `GET /api/countries` - Get all countries with continent info
- `POST /api/countries` - Create new country
- `PUT /api/countries/:id` - Update existing country
- `DELETE /api/countries/:id` - Delete country

## Frontend Components

### CountryManagement.jsx
Main component providing:
- Country list table with sorting and filtering
- Add/Edit modal form
- Delete confirmation
- Status toggle functionality
- Image upload for flags
- Real-time validation
- Loading states and error handling

### Features Implemented
- ✅ Responsive design
- ✅ Form validation
- ✅ Image upload and preview
- ✅ Status toggle
- ✅ CRUD operations
- ✅ Error handling
- ✅ Loading indicators
- ✅ Confirmation dialogs

## Usage

### Accessing Country Management
1. Login to admin dashboard at `http://localhost:3000/admin`
2. Click on "Country List" in the sidebar
3. Select "Country" from the submenu

### Adding a New Country
1. Click "Add Country" button
2. Fill in the required fields:
   - Select continent
   - Enter country name
   - Enter country code
3. Optionally add:
   - Currency
   - Flag image
   - ISO code
   - Nationality
   - Display order
4. Click "Add Country" to save

### Editing a Country
1. Click the edit (✏️) button in the action column
2. Modify the desired fields
3. Click "Update Country" to save changes

### Deleting a Country
1. Click the delete (🗑️) button in the action column
2. Confirm deletion in the popup dialog

### Toggle Status
- Use the switch in the Status column to activate/deactivate countries

## File Structure
```
role-based-auth/
├── src/
│   ├── components/
│   │   ├── CountryManagement.jsx     # Main country management component
│   │   └── AdminDashboard.jsx        # Updated to include country management
│   └── styles/
│       └── CountryManagement.css     # Styling for country management
├── server/
│   ├── database.js                   # Database functions for countries/continents
│   └── server.js                     # API endpoints
├── database/
│   └── schema.sql                    # Updated database schema
└── COUNTRY_MANAGEMENT_GUIDE.md       # This documentation
```

## Technical Details

### Technologies Used
- **Frontend**: React, React Bootstrap, CSS3
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL with UUID primary keys
- **File Upload**: Base64 encoding for flag images

### Security Features
- Input validation on both frontend and backend
- SQL injection prevention using parameterized queries
- CORS enabled for cross-origin requests
- Error handling and logging

## Future Enhancements

### Planned Features
- State/Province management
- District management
- Bulk import/export functionality
- Advanced search and filtering
- Country flag validation
- Multi-language support
- Audit trail for changes

### API Extensions
- Pagination for large datasets
- Advanced filtering options
- Bulk operations
- Data export endpoints

## Troubleshooting

### Common Issues
1. **Database Connection**: Ensure PostgreSQL is running and credentials are correct
2. **Port Conflicts**: Make sure ports 3000 (frontend) and 3001 (backend) are available
3. **Image Upload**: Large images may need compression before upload
4. **CORS Issues**: Verify CORS settings in server configuration

### Error Messages
- "Country code already exists" - Use a unique country code
- "Invalid continent selected" - Select a valid continent from dropdown
- "Failed to fetch countries" - Check database connection and server status

## Support

For issues or questions about the country management system, please check:
1. Server logs for backend errors
2. Browser console for frontend errors
3. Database connection status
4. API endpoint responses

The system is designed to be robust and user-friendly, providing a complete solution for managing geographical location data in your application.
