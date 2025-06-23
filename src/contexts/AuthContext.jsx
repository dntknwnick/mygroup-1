import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dbConnected, setDbConnected] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      // Test API connection
      try {
        const response = await fetch('/api/health');
        setDbConnected(response.ok);
      } catch (error) {
        console.log('API not available, using mock data');
        setDbConnected(false);
      }

      // Check if user is logged in from localStorage
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (username, password) => {
    try {
      if (!dbConnected) {
        // Fallback to mock authentication if API is not available
        return mockLogin(username, password);
      }

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (result.success) {
        const user = {
          id: result.user.id,
          username: result.user.username,
          role: result.user.role,
          name: result.user.full_name || result.user.display_name || result.user.username,
          email: result.user.email_id,
          createdBy: result.user.created_by
        };
        
        setCurrentUser(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
        return { success: true, user };
      }
      return result;
    } catch (error) {
      console.error('Login error:', error);
      // Fallback to mock login if API fails
      return mockLogin(username, password);
    }
  };

  // Fallback mock login for when database is not available
  const mockLogin = (username, password) => {
    const mockUsers = [
      { id: '1', username: 'superadmin', password: 'password123', role: 'SUPER_ADMIN', name: 'Super Administrator' },
      { id: '2', username: 'corporate1', password: 'password123', role: 'CORPORATE', name: 'Corporate User 1', createdBy: '1' },
      { id: '3', username: 'branch1', password: 'password123', role: 'BRANCH', name: 'Branch User 1', createdBy: '2' }
    ];

    const user = mockUsers.find(u => u.username === username && u.password === password);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return { success: true, user };
    }
    return { success: false, error: 'Invalid credentials' };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const createUser = async (userData) => {
    try {
      if (!dbConnected) {
        // Mock user creation for fallback
        const newUser = {
          id: Date.now().toString(),
          username: userData.username,
          role: userData.role,
          name: userData.name || userData.username,
          email: userData.email,
          mobile: userData.mobile,
          createdBy: currentUser?.id || null // Use null for self-registered users
        };
        return newUser;
      }

      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: userData.username,
          password: userData.password,
          role: userData.role,
          full_name: userData.fullName || userData.name,
          email_id: userData.emailId || userData.email,
          mobile: userData.mobile,
          created_by: currentUser?.id || null, // Use null for self-registered users
          // Additional user details
          display_name: userData.displayName,
          gender: userData.gender,
          martial_status: userData.martialStatus,
          country_id: userData.countryId,
          state_id: userData.stateId,
          district_id: userData.districtId,
          nationality: userData.nationality,
          education: userData.education,
          profession: userData.profession,
          date_of_birth: userData.dateOfBirth
        }),
      });

      const result = await response.json();

      if (result.success) {
        return {
          id: result.user.id,
          username: result.user.username,
          role: result.user.role,
          name: userData.name || userData.username,
          createdBy: currentUser?.id || null
        };
      }
      throw new Error(result.error);
    } catch (error) {
      console.error('Create user error:', error);

      // Check if it's a duplicate user error
      if (error.message && error.message.includes('duplicate key')) {
        throw new Error('User already exists with this mobile number');
      }

      // For other API errors, throw the original error
      if (error.message && !error.message.includes('fetch')) {
        throw error;
      }

      // Fallback to mock creation only if API is completely unavailable
      const newUser = {
        id: Date.now().toString(),
        username: userData.username,
        role: userData.role,
        name: userData.name || userData.username,
        email: userData.email,
        mobile: userData.mobile,
        createdBy: currentUser?.id || null // Use null for self-registered users
      };
      return newUser;
    }
  };

  const getUsersByCreator = async (creatorId) => {
    try {
      if (!dbConnected) {
        // Mock data for fallback
        return [];
      }

      const response = await fetch(`/api/users/created-by/${creatorId}`);
      const result = await response.json();

      if (result.success) {
        return result.users.map(user => ({
          id: user.id,
          username: user.username,
          role: user.role,
          name: user.full_name || user.display_name || user.username,
          email: user.email_id,
          isActive: user.is_active,
          createdOn: user.created_on
        }));
      }
      return [];
    } catch (error) {
      console.error('Get users by creator error:', error);
      return [];
    }
  };

  const value = {
    currentUser,
    login,
    logout,
    createUser,
    getUsersByCreator,
    loading,
    dbConnected
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
