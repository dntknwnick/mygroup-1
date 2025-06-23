import { pool } from '../config/db.js';

class LocationModel {
  // ==================== CONTINENT METHODS ====================
  
  // Get all continents
  static async getContinents() {
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
  }

  // Create continent
  static async createContinent(continentData) {
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
  }

  // Update continent
  static async updateContinent(continentId, continentData) {
    try {
      const { name, code, display_order, is_active } = continentData;
      const query = `
        UPDATE continents 
        SET name = $1, code = $2, display_order = $3, is_active = $4, updated_at = CURRENT_TIMESTAMP
        WHERE id = $5
        RETURNING id, name, code, display_order, is_active, created_at, updated_at
      `;
      const result = await pool.query(query, [name, code, display_order, is_active, continentId]);
      
      if (result.rows.length === 0) {
        return { success: false, error: 'Continent not found' };
      }
      
      return { success: true, data: result.rows[0] };
    } catch (error) {
      console.error('Update continent error:', error);
      if (error.code === '23505') {
        return { success: false, error: 'Continent name or code already exists' };
      }
      return { success: false, error: 'Failed to update continent' };
    }
  }

  // Delete continent
  static async deleteContinent(continentId) {
    try {
      const query = 'DELETE FROM continents WHERE id = $1 RETURNING id';
      const result = await pool.query(query, [continentId]);
      
      if (result.rows.length === 0) {
        return { success: false, error: 'Continent not found' };
      }
      
      return { success: true, message: 'Continent deleted successfully' };
    } catch (error) {
      console.error('Delete continent error:', error);
      if (error.code === '23503') {
        return { success: false, error: 'Cannot delete continent. It has associated countries.' };
      }
      return { success: false, error: 'Failed to delete continent' };
    }
  }

  // ==================== COUNTRY METHODS ====================
  
  // Get all countries
  static async getCountries() {
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
  }

  // Get countries by continent
  static async getCountriesByContinent(continentId) {
    try {
      const query = `
        SELECT 
          c.id, c.name, c.code, c.currency, c.flag_image, c.iso_code, 
          c.nationality, c.display_order, c.is_active, c.created_at, c.updated_at
        FROM countries c
        WHERE c.continent_id = $1 AND c.is_active = true
        ORDER BY c.display_order ASC, c.name ASC
      `;
      const result = await pool.query(query, [continentId]);
      return { success: true, data: result.rows };
    } catch (error) {
      console.error('Get countries by continent error:', error);
      return { success: false, error: 'Failed to fetch countries' };
    }
  }

  // Create country
  static async createCountry(countryData) {
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
  }

  // Update country
  static async updateCountry(countryId, countryData) {
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
  }

  // Delete country
  static async deleteCountry(countryId) {
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
  }

  // Get country by ID
  static async getCountryById(countryId) {
    try {
      const query = `
        SELECT 
          c.id, c.name, c.code, c.currency, c.flag_image, c.iso_code, 
          c.nationality, c.display_order, c.is_active, c.created_at, c.updated_at,
          cont.name as continent_name, cont.id as continent_id
        FROM countries c
        LEFT JOIN continents cont ON c.continent_id = cont.id
        WHERE c.id = $1
      `;
      const result = await pool.query(query, [countryId]);
      
      if (result.rows.length === 0) {
        return { success: false, error: 'Country not found' };
      }
      
      return { success: true, data: result.rows[0] };
    } catch (error) {
      console.error('Get country by ID error:', error);
      return { success: false, error: 'Failed to fetch country' };
    }
  }

  // ==================== STATE METHODS (Future Implementation) ====================
  
  // Get states by country
  static async getStatesByCountry(countryId) {
    try {
      const query = `
        SELECT id, name, code, display_order, is_active, created_at, updated_at
        FROM states 
        WHERE country_id = $1 AND is_active = true
        ORDER BY display_order ASC, name ASC
      `;
      const result = await pool.query(query, [countryId]);
      return { success: true, data: result.rows };
    } catch (error) {
      console.error('Get states by country error:', error);
      return { success: false, error: 'Failed to fetch states' };
    }
  }

  // ==================== DISTRICT METHODS (Future Implementation) ====================
  
  // Get districts by state
  static async getDistrictsByState(stateId) {
    try {
      const query = `
        SELECT id, name, code, display_order, is_active, created_at, updated_at
        FROM districts 
        WHERE state_id = $1 AND is_active = true
        ORDER BY display_order ASC, name ASC
      `;
      const result = await pool.query(query, [stateId]);
      return { success: true, data: result.rows };
    } catch (error) {
      console.error('Get districts by state error:', error);
      return { success: false, error: 'Failed to fetch districts' };
    }
  }
}

export default LocationModel;
