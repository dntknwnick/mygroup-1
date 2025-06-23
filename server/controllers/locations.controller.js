import LocationModel from '../models/locations.model.js';

class LocationController {
  // ==================== CONTINENT CONTROLLERS ====================
  
  // Get all continents
  static async getContinents(req, res) {
    try {
      const result = await LocationModel.getContinents();
      
      if (result.success) {
        res.json(result);
      } else {
        res.status(500).json(result);
      }
    } catch (error) {
      console.error('Get continents controller error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  // Create continent
  static async createContinent(req, res) {
    try {
      const continentData = req.body;
      
      if (!continentData.name || !continentData.code) {
        return res.status(400).json({
          success: false,
          error: 'Name and code are required'
        });
      }
      
      const result = await LocationModel.createContinent(continentData);
      
      if (result.success) {
        res.status(201).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error('Create continent controller error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  // Update continent
  static async updateContinent(req, res) {
    try {
      const { continentId } = req.params;
      const continentData = req.body;
      
      if (!continentId) {
        return res.status(400).json({
          success: false,
          error: 'Continent ID is required'
        });
      }
      
      if (!continentData.name || !continentData.code) {
        return res.status(400).json({
          success: false,
          error: 'Name and code are required'
        });
      }
      
      const result = await LocationModel.updateContinent(continentId, continentData);
      
      if (result.success) {
        res.json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error('Update continent controller error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  // Delete continent
  static async deleteContinent(req, res) {
    try {
      const { continentId } = req.params;
      
      if (!continentId) {
        return res.status(400).json({
          success: false,
          error: 'Continent ID is required'
        });
      }
      
      const result = await LocationModel.deleteContinent(continentId);
      
      if (result.success) {
        res.json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error('Delete continent controller error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  // ==================== COUNTRY CONTROLLERS ====================
  
  // Get all countries
  static async getCountries(req, res) {
    try {
      const { continentId } = req.query;
      
      let result;
      if (continentId) {
        result = await LocationModel.getCountriesByContinent(continentId);
      } else {
        result = await LocationModel.getCountries();
      }
      
      if (result.success) {
        res.json(result);
      } else {
        res.status(500).json(result);
      }
    } catch (error) {
      console.error('Get countries controller error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  // Get country by ID
  static async getCountryById(req, res) {
    try {
      const { countryId } = req.params;
      
      if (!countryId) {
        return res.status(400).json({
          success: false,
          error: 'Country ID is required'
        });
      }
      
      const result = await LocationModel.getCountryById(countryId);
      
      if (result.success) {
        res.json(result);
      } else {
        res.status(404).json(result);
      }
    } catch (error) {
      console.error('Get country by ID controller error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  // Create country
  static async createCountry(req, res) {
    try {
      const countryData = req.body;
      
      if (!countryData.continent_id || !countryData.name || !countryData.code) {
        return res.status(400).json({
          success: false,
          error: 'Continent, name, and code are required'
        });
      }
      
      const result = await LocationModel.createCountry(countryData);
      
      if (result.success) {
        res.status(201).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error('Create country controller error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  // Update country
  static async updateCountry(req, res) {
    try {
      const { countryId } = req.params;
      const countryData = req.body;
      
      if (!countryId) {
        return res.status(400).json({
          success: false,
          error: 'Country ID is required'
        });
      }
      
      if (!countryData.continent_id || !countryData.name || !countryData.code) {
        return res.status(400).json({
          success: false,
          error: 'Continent, name, and code are required'
        });
      }
      
      const result = await LocationModel.updateCountry(countryId, countryData);
      
      if (result.success) {
        res.json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error('Update country controller error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  // Delete country
  static async deleteCountry(req, res) {
    try {
      const { countryId } = req.params;
      
      if (!countryId) {
        return res.status(400).json({
          success: false,
          error: 'Country ID is required'
        });
      }
      
      const result = await LocationModel.deleteCountry(countryId);
      
      if (result.success) {
        res.json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error('Delete country controller error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  // ==================== STATE CONTROLLERS (Future Implementation) ====================
  
  // Get states by country
  static async getStatesByCountry(req, res) {
    try {
      const { countryId } = req.params;
      
      if (!countryId) {
        return res.status(400).json({
          success: false,
          error: 'Country ID is required'
        });
      }
      
      const result = await LocationModel.getStatesByCountry(countryId);
      
      if (result.success) {
        res.json(result);
      } else {
        res.status(500).json(result);
      }
    } catch (error) {
      console.error('Get states by country controller error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  // ==================== DISTRICT CONTROLLERS (Future Implementation) ====================
  
  // Get districts by state
  static async getDistrictsByState(req, res) {
    try {
      const { stateId } = req.params;
      
      if (!stateId) {
        return res.status(400).json({
          success: false,
          error: 'State ID is required'
        });
      }
      
      const result = await LocationModel.getDistrictsByState(stateId);
      
      if (result.success) {
        res.json(result);
      } else {
        res.status(500).json(result);
      }
    } catch (error) {
      console.error('Get districts by state controller error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  // ==================== UTILITY CONTROLLERS ====================
  
  // Get location hierarchy (continent -> countries -> states -> districts)
  static async getLocationHierarchy(req, res) {
    try {
      const continents = await LocationModel.getContinents();
      
      if (!continents.success) {
        return res.status(500).json(continents);
      }
      
      // Build hierarchy with countries for each continent
      const hierarchy = await Promise.all(
        continents.data.map(async (continent) => {
          const countries = await LocationModel.getCountriesByContinent(continent.id);
          return {
            ...continent,
            countries: countries.success ? countries.data : []
          };
        })
      );
      
      res.json({
        success: true,
        data: hierarchy
      });
    } catch (error) {
      console.error('Get location hierarchy controller error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
}

export default LocationController;
