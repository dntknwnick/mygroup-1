import express from 'express';
import UserController from '../controllers/users.controller.js';

const router = express.Router();

// Authentication routes
router.post('/login', UserController.login);

// User CRUD routes
router.post('/', UserController.createUser);
router.get('/', UserController.getAllUsers);
router.get('/:userId', UserController.getUserById);
router.put('/:userId/status', UserController.updateUserStatus);
router.delete('/:userId', UserController.deleteUser);

// User details routes
router.put('/update-details', UserController.updateUserDetails);

// User management routes
router.get('/creator/:creatorId', UserController.getUsersByCreator);

// Password management routes
router.put('/:userId/change-password', UserController.changePassword);

// Export router
export default router;
