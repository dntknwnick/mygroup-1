import React from 'react';
import { Alert } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';

const DatabaseStatus = () => {
  const { dbConnected } = useAuth();

  if (dbConnected) {
    return (
      <Alert variant="success" className="mb-3">
        <strong>✅ API Connected</strong> - Full database functionality available
      </Alert>
    );
  }

  return (
    <Alert variant="warning" className="mb-3">
      <strong>⚠️ API Not Available</strong> - Using mock data mode
      <br />
      <small>
        To enable full database functionality:
        <br />
        1. Set up a backend API server
        <br />
        2. Install PostgreSQL and create 'my_group_db' database
        <br />
        3. Run the schema.sql and sample_data.sql scripts
        <br />
        4. Configure API endpoints for authentication and user management
      </small>
    </Alert>
  );
};

export default DatabaseStatus;
