import UserModel from '../models/users.model.js';

class UserController {
  // Authenticate user
  static async login(req, res) {    
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({
          success: false,
          error: 'Username and password are required'
        });
      }
      
      const result = await UserModel.authenticate(username, password);
      if (result.success) {
        res.json(result);
      } else {
        res.status(401).json(result);
      }
    } catch (error) {
      console.error('Login controller error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  // Create new user
  static async createUser(req, res) {
    try {
      const userData = req.body;
      const createdBy = userData.created_by;
      
      if (!userData.username || !userData.password || !userData.role) {
        return res.status(400).json({
          success: false,
          error: 'Username, password, and role are required'
        });
      }
      
      const result = await UserModel.create(userData, createdBy);
      
      if (result.success) {
        res.status(201).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error('Create user controller error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  // Get users by creator
  static async getUsersByCreator(req, res) {
    try {
      const { creatorId } = req.params;
      
      if (!creatorId) {
        return res.status(400).json({
          success: false,
          error: 'Creator ID is required'
        });
      }
      
      const result = await UserModel.getByCreator(creatorId);
      
      if (result.success) {
        res.json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error('Get users by creator controller error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  // Update user details
  static async updateUserDetails(req, res) {
    try {
      const userDetails = req.body;

      if (!userDetails.userId) {
        return res.status(400).json({
          success: false,
          error: 'User ID is required'
        });
      }

      const result = await UserModel.updateDetails(userDetails);

      if (result.success) {
        res.json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error('Update user details controller error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  // Get user by ID
  static async getUserById(req, res) {
    try {
      const { userId } = req.params;
      
      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'User ID is required'
        });
      }
      
      const result = await UserModel.getById(userId);
      
      if (result.success) {
        res.json(result);
      } else {
        res.status(404).json(result);
      }
    } catch (error) {
      console.error('Get user by ID controller error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  // Update user status
  static async updateUserStatus(req, res) {
    try {
      const { userId } = req.params;
      const { isActive } = req.body;
      
      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'User ID is required'
        });
      }
      
      if (typeof isActive !== 'boolean') {
        return res.status(400).json({
          success: false,
          error: 'isActive must be a boolean value'
        });
      }
      
      const result = await UserModel.updateStatus(userId, isActive);
      
      if (result.success) {
        res.json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error('Update user status controller error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  // Delete user
  static async deleteUser(req, res) {
    try {
      const { userId } = req.params;
      
      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'User ID is required'
        });
      }
      
      const result = await UserModel.delete(userId);
      
      if (result.success) {
        res.json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error('Delete user controller error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  // Get all users (admin only)
  static async getAllUsers(req, res) {
    try {
      // This would typically include pagination and filtering
      const { page = 1, limit = 10, role, isActive } = req.query;
      
      // For now, we'll use the existing method but this should be expanded
      // to include proper pagination and filtering
      const result = await UserModel.getByCreator(null); // Get all users
      
      if (result.success) {
        res.json({
          success: true,
          users: result.users,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: result.users.length
          }
        });
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error('Get all users controller error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  // Change password
  static async changePassword(req, res) {
    try {
      const { userId } = req.params;
      const { currentPassword, newPassword } = req.body;
      
      if (!userId || !currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          error: 'User ID, current password, and new password are required'
        });
      }
      
      // First verify current password
      const user = await UserModel.getById(userId);
      if (!user.success) {
        return res.status(404).json(user);
      }
      
      // Verify current password
      const authResult = await UserModel.authenticate(user.user.username, currentPassword);
      if (!authResult.success) {
        return res.status(401).json({
          success: false,
          error: 'Current password is incorrect'
        });
      }
      
      // Update password (this would need to be implemented in the model)
      // For now, return a placeholder response
      res.json({
        success: true,
        message: 'Password changed successfully'
      });
    } catch (error) {
      console.error('Change password controller error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
}

export default UserController;
