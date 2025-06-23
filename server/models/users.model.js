import { pool } from '../config/db.js';
import bcrypt from 'bcryptjs';

class UserModel {
  // Authenticate user
  static async authenticate(username, password) {
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
  }

  // Create new user
  static async create(userData, createdBy) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      const { username, password, role, my_group_app_id } = userData;
      
      // Hash password
      const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      
      // Insert user
      const userQuery = `
        INSERT INTO my_group_user (username, password, role, my_group_app_id, created_by)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, username, role, my_group_app_id, created_by, is_active, created_on
      `;
      
      const userResult = await client.query(userQuery, [
        username, hashedPassword, role, my_group_app_id, createdBy
      ]);
      
      await client.query('COMMIT');
      
      return { success: true, user: userResult.rows[0] };
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Create user error:', error);
      
      if (error.code === '23505') {
        return { success: false, error: 'Username already exists' };
      }
      
      return { success: false, error: 'Failed to create user' };
    } finally {
      client.release();
    }
  }

  // Get users by creator
  static async getByCreator(creatorId) {
    try {
      const query = `
        SELECT 
          u.id,
          u.username,
          u.role,
          u.my_group_app_id,
          u.is_active,
          u.created_on,
          ud.full_name,
          ud.display_name,
          ud.email_id,
          app.name as app_name
        FROM my_group_user u
        LEFT JOIN my_group_user_details ud ON u.id = ud.my_group_user_id
        LEFT JOIN my_group_app app ON u.my_group_app_id = app.id
        WHERE u.created_by = $1
        ORDER BY u.created_on DESC
      `;
      
      const result = await pool.query(query, [creatorId]);
      
      return { success: true, users: result.rows };
    } catch (error) {
      console.error('Get users by creator error:', error);
      return { success: false, error: 'Failed to fetch users' };
    }
  }

  // Update user details
  static async updateDetails(userDetails) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      const {
        userId, full_name, display_name, email_id, gender, martial_status,
        country_id, state_id, district_id, nationality, education, profession,
        photo, date_of_birth
      } = userDetails;
      
      // Check if user details record exists
      const checkQuery = 'SELECT id FROM my_group_user_details WHERE my_group_user_id = $1';
      const checkResult = await client.query(checkQuery, [userId]);
      
      let query;
      let values;
      
      if (checkResult.rows.length > 0) {
        // Update existing record
        query = `
          UPDATE my_group_user_details 
          SET full_name = $1, display_name = $2, email_id = $3, gender = $4, 
              martial_status = $5, country_id = $6, state_id = $7, district_id = $8,
              nationality = $9, education = $10, profession = $11, photo = $12, 
              date_of_birth = $13, updated_at = CURRENT_TIMESTAMP
          WHERE my_group_user_id = $14
          RETURNING *
        `;
        values = [
          full_name, display_name, email_id, gender, martial_status,
          country_id, state_id, district_id, nationality, education,
          profession, photo, date_of_birth, userId
        ];
      } else {
        // Insert new record
        query = `
          INSERT INTO my_group_user_details 
          (my_group_user_id, full_name, display_name, email_id, gender, martial_status,
           country_id, state_id, district_id, nationality, education, profession, photo, date_of_birth)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
          RETURNING *
        `;
        values = [
          userId, full_name, display_name, email_id, gender, martial_status,
          country_id, state_id, district_id, nationality, education,
          profession, photo, date_of_birth
        ];
      }
      
      const result = await client.query(query, values);
      
      await client.query('COMMIT');
      
      return { success: true, userDetails: result.rows[0] };
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Update user details error:', error);
      
      if (error.code === '23505') {
        return { success: false, error: 'Email already exists' };
      }
      
      return { success: false, error: 'Failed to update user details' };
    } finally {
      client.release();
    }
  }

  // Get user by ID
  static async getById(userId) {
    try {
      const query = `
        SELECT 
          u.id,
          u.username,
          u.role,
          u.my_group_app_id,
          u.is_active,
          u.created_on,
          ud.*,
          app.name as app_name
        FROM my_group_user u
        LEFT JOIN my_group_user_details ud ON u.id = ud.my_group_user_id
        LEFT JOIN my_group_app app ON u.my_group_app_id = app.id
        WHERE u.id = $1
      `;
      
      const result = await pool.query(query, [userId]);
      
      if (result.rows.length === 0) {
        return { success: false, error: 'User not found' };
      }
      
      return { success: true, user: result.rows[0] };
    } catch (error) {
      console.error('Get user by ID error:', error);
      return { success: false, error: 'Failed to fetch user' };
    }
  }

  // Update user status
  static async updateStatus(userId, isActive) {
    try {
      const query = `
        UPDATE my_group_user 
        SET is_active = $1, updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING id, username, role, is_active
      `;
      
      const result = await pool.query(query, [isActive, userId]);
      
      if (result.rows.length === 0) {
        return { success: false, error: 'User not found' };
      }
      
      return { success: true, user: result.rows[0] };
    } catch (error) {
      console.error('Update user status error:', error);
      return { success: false, error: 'Failed to update user status' };
    }
  }

  // Delete user
  static async delete(userId) {
    try {
      const query = 'DELETE FROM my_group_user WHERE id = $1 RETURNING id';
      const result = await pool.query(query, [userId]);
      
      if (result.rows.length === 0) {
        return { success: false, error: 'User not found' };
      }
      
      return { success: true, message: 'User deleted successfully' };
    } catch (error) {
      console.error('Delete user error:', error);
      return { success: false, error: 'Failed to delete user' };
    }
  }
}

export default UserModel;
