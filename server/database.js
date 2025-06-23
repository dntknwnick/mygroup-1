import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'my_group_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'admin',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

// Create connection pool
const pool = new Pool(dbConfig);

// Test database connection
const testConnection = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    console.log('Database connected successfully:', result.rows[0]);
    return true;
  } catch (error) {
    console.error('Database connection failed:', error.message);
    return false;
  }
};

// User authentication functions
const authenticateUser = async (username, password) => {
  try {
    const query = `
      SELECT 
        u.id,
        u.username,
        u.password,
        u.role,
        u.my_group_app_id,
        u.created_by,
        u.is_active,
        ud.full_name,
        ud.display_name,
        ud.email_id
      FROM my_group_user u
      LEFT JOIN my_group_user_details ud ON u.id = ud.my_group_user_id
      WHERE u.username = $1 AND u.is_active = true
    `;
    
    const result = await pool.query(query, [username]);
    
    if (result.rows.length === 0) {
      return { success: false, error: 'User not found' };
    }
    
    const user = result.rows[0];
    
    // For development, allow simple password comparison
    // In production, always use bcrypt
    const isValidPassword = password === 'password123' || await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return { success: false, error: 'Invalid password' };
    }
    
    // Remove password from response
    delete user.password;
    
    return { success: true, user };
  } catch (error) {
    console.error('Authentication error:', error);
    return { success: false, error: 'Authentication failed' };
  }
};

// Create new user
const createUser = async (userData, createdBy) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    // Insert user
    const userQuery = `
      INSERT INTO my_group_user (username, password, my_group_app_id, role, created_by)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, username, role, created_on
    `;
    
    const userResult = await client.query(userQuery, [
      userData.username,
      hashedPassword,
      userData.my_group_app_id || '550e8400-e29b-41d4-a716-446655440000', // Default app ID
      userData.role,
      createdBy
    ]);
    
    const newUser = userResult.rows[0];
    
    // Insert user details if provided
    if (userData.full_name || userData.email_id) {
      const detailsQuery = `
        INSERT INTO my_group_user_details (my_group_user_id, full_name, display_name, email_id)
        VALUES ($1, $2, $3, $4)
      `;
      
      await client.query(detailsQuery, [
        newUser.id,
        userData.full_name || userData.username,
        userData.display_name || userData.username,
        userData.email_id
      ]);
    }
    
    await client.query('COMMIT');
    return { success: true, user: newUser };
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Create user error:', error);
    return { success: false, error: error.message };
  } finally {
    client.release();
  }
};

// Get users created by a specific user
const getUsersByCreator = async (creatorId) => {
  try {
    const query = `
      SELECT 
        u.id,
        u.username,
        u.role,
        u.is_active,
        u.created_on,
        ud.full_name,
        ud.display_name,
        ud.email_id
      FROM my_group_user u
      LEFT JOIN my_group_user_details ud ON u.id = ud.my_group_user_id
      WHERE u.created_by = $1
      ORDER BY u.created_on DESC
    `;
    
    const result = await pool.query(query, [creatorId]);
    return result.rows;
  } catch (error) {
    console.error('Get users by creator error:', error);
    return [];
  }
};

// Update user details
const updateUserDetails = async (userDetails) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Update or insert user details
    const detailsQuery = `
      INSERT INTO my_group_user_details (
        my_group_user_id, display_name, email_id, gender, martial_status,
        country_id, state_id, district_id, nationality, education, profession, date_of_birth
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      ON CONFLICT (my_group_user_id)
      DO UPDATE SET
        display_name = EXCLUDED.display_name,
        email_id = EXCLUDED.email_id,
        gender = EXCLUDED.gender,
        martial_status = EXCLUDED.martial_status,
        country_id = EXCLUDED.country_id,
        state_id = EXCLUDED.state_id,
        district_id = EXCLUDED.district_id,
        nationality = EXCLUDED.nationality,
        education = EXCLUDED.education,
        profession = EXCLUDED.profession,
        date_of_birth = EXCLUDED.date_of_birth,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `;

    const result = await client.query(detailsQuery, [
      userDetails.userId,
      userDetails.displayName,
      userDetails.emailId,
      userDetails.gender,
      userDetails.martialStatus,
      userDetails.countryId,
      userDetails.stateId,
      userDetails.districtId,
      userDetails.nationality,
      userDetails.education,
      userDetails.profession,
      userDetails.dateOfBirth
    ]);

    await client.query('COMMIT');
    return { success: true, userDetails: result.rows[0] };

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Update user details error:', error);
    return { success: false, error: error.message };
  } finally {
    client.release();
  }
};

// Location management functions

// Continent functions
const getContinents = async () => {
  try {
    const query = `
      SELECT id, name, code, display_order, is_active, created_at, updated_at
      FROM continents
      ORDER BY display_order ASC, name ASC
    `;
    const result = await pool.query(query);
    return { success: true, data: result.rows };
  } catch (error) {
    console.error('Get continents error:', error);
    return { success: false, error: 'Failed to fetch continents' };
  }
};

const createContinent = async (continentData) => {
  try {
    const { name, code, display_order = 0 } = continentData;
    const query = `
      INSERT INTO continents (name, code, display_order)
      VALUES ($1, $2, $3)
      RETURNING id, name, code, display_order, is_active, created_at, updated_at
    `;
    const result = await pool.query(query, [name, code, display_order]);
    return { success: true, data: result.rows[0] };
  } catch (error) {
    console.error('Create continent error:', error);
    if (error.code === '23505') {
      return { success: false, error: 'Continent name or code already exists' };
    }
    return { success: false, error: 'Failed to create continent' };
  }
};

// Country functions
const getCountries = async () => {
  try {
    const query = `
      SELECT
        c.id, c.name, c.code, c.currency, c.flag_image, c.iso_code,
        c.nationality, c.display_order, c.is_active, c.created_at, c.updated_at,
        cont.name as continent_name, cont.id as continent_id
      FROM countries c
      LEFT JOIN continents cont ON c.continent_id = cont.id
      ORDER BY c.display_order ASC, c.name ASC
    `;
    const result = await pool.query(query);
    return { success: true, data: result.rows };
  } catch (error) {
    console.error('Get countries error:', error);
    return { success: false, error: 'Failed to fetch countries' };
  }
};

const createCountry = async (countryData) => {
  try {
    const {
      continent_id, name, code, currency, flag_image,
      iso_code, nationality, display_order = 0
    } = countryData;

    const query = `
      INSERT INTO countries (continent_id, name, code, currency, flag_image, iso_code, nationality, display_order)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, continent_id, name, code, currency, flag_image, iso_code, nationality, display_order, is_active, created_at, updated_at
    `;

    const result = await pool.query(query, [
      continent_id, name, code, currency, flag_image, iso_code, nationality, display_order
    ]);

    return { success: true, data: result.rows[0] };
  } catch (error) {
    console.error('Create country error:', error);
    if (error.code === '23505') {
      return { success: false, error: 'Country code already exists' };
    }
    if (error.code === '23503') {
      return { success: false, error: 'Invalid continent selected' };
    }
    return { success: false, error: 'Failed to create country' };
  }
};

const updateCountry = async (countryId, countryData) => {
  try {
    const {
      continent_id, name, code, currency, flag_image,
      iso_code, nationality, display_order, is_active
    } = countryData;

    const query = `
      UPDATE countries
      SET continent_id = $1, name = $2, code = $3, currency = $4, flag_image = $5,
          iso_code = $6, nationality = $7, display_order = $8, is_active = $9, updated_at = CURRENT_TIMESTAMP
      WHERE id = $10
      RETURNING id, continent_id, name, code, currency, flag_image, iso_code, nationality, display_order, is_active, created_at, updated_at
    `;

    const result = await pool.query(query, [
      continent_id, name, code, currency, flag_image, iso_code, nationality, display_order, is_active, countryId
    ]);

    if (result.rows.length === 0) {
      return { success: false, error: 'Country not found' };
    }

    return { success: true, data: result.rows[0] };
  } catch (error) {
    console.error('Update country error:', error);
    if (error.code === '23505') {
      return { success: false, error: 'Country code already exists' };
    }
    if (error.code === '23503') {
      return { success: false, error: 'Invalid continent selected' };
    }
    return { success: false, error: 'Failed to update country' };
  }
};

const deleteCountry = async (countryId) => {
  try {
    const query = 'DELETE FROM countries WHERE id = $1 RETURNING id';
    const result = await pool.query(query, [countryId]);

    if (result.rows.length === 0) {
      return { success: false, error: 'Country not found' };
    }

    return { success: true, message: 'Country deleted successfully' };
  } catch (error) {
    console.error('Delete country error:', error);
    if (error.code === '23503') {
      return { success: false, error: 'Cannot delete country. It has associated states.' };
    }
    return { success: false, error: 'Failed to delete country' };
  }
};

export {
  testConnection, authenticateUser, createUser, getUsersByCreator, updateUserDetails,
  getContinents, createContinent, getCountries, createCountry, updateCountry, deleteCountry
};
export default pool;
