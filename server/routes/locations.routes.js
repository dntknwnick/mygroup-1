import express from 'express';
import LocationController from '../controllers/locations.controller.js';

const router = express.Router();

// ==================== CONTINENT ROUTES ====================
router.get('/continents', LocationController.getContinents);
router.post('/continents', LocationController.createContinent);
router.put('/continents/:continentId', LocationController.updateContinent);
router.delete('/continents/:continentId', LocationController.deleteContinent);

// ==================== COUNTRY ROUTES ====================
router.get('/countries', LocationController.getCountries);
router.get('/countries/:countryId', LocationController.getCountryById);
router.post('/countries', LocationController.createCountry);
router.put('/countries/:countryId', LocationController.updateCountry);
router.delete('/countries/:countryId', LocationController.deleteCountry);

// ==================== STATE ROUTES (Future Implementation) ====================
router.get('/countries/:countryId/states', LocationController.getStatesByCountry);

// ==================== DISTRICT ROUTES (Future Implementation) ====================
router.get('/states/:stateId/districts', LocationController.getDistrictsByState);

// ==================== UTILITY ROUTES ====================
router.get('/hierarchy', LocationController.getLocationHierarchy);

// Export router
export default router;
