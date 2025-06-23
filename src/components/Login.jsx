import React, { useState } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';

const Login = ({ onLoginSuccess }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleInputChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!credentials.username || !credentials.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await login(credentials.username, credentials.password);
      if (result.success) {
        // Call the success callback to close modal
        if (onLoginSuccess) {
          onLoginSuccess();
        }
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}

      <Form.Group className="mb-3">
        <Form.Label>Username / Mobile Number</Form.Label>
        <Form.Control
          type="text"
          name="username"
          placeholder="Enter username or mobile number"
          value={credentials.username}
          onChange={handleInputChange}
          disabled={loading}
          required
        />
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          name="password"
          placeholder="Enter password"
          value={credentials.password}
          onChange={handleInputChange}
          disabled={loading}
          required
        />
      </Form.Group>

      <div className="d-grid">
        <Button
          variant="primary"
          type="submit"
          size="lg"
          disabled={loading}
          className="rounded-pill"
        >
          {loading ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                className="me-2"
              />
              Logging in...
            </>
          ) : (
            'Login'
          )}
        </Button>
      </div>
    </Form>
  );
};

export default Login;
