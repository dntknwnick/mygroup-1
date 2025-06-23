import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner, Badge } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(credentials.username, credentials.password);
      console.log('Login result:', result); // Debug log

      if (result.success) {
        const user = result.user;
        console.log('User role:', user.role); // Debug log

        // Check if user has admin privileges
        if (!['SUPER_ADMIN', 'CORPORATE', 'BRANCH'].includes(user.role)) {
          setError('Access denied. Admin privileges required.');
          setLoading(false);
          return;
        }

        // Redirect to new admin dashboard for all admin roles
        navigate('/admin-dashboard');
      } else {
        setError(result.error || 'Invalid admin credentials');
      }
    } catch (err) {
      console.error('Login error:', err); // Debug log
      setError('Invalid admin credentials');
    } finally {
      setLoading(false);
    }
  };

  const adminAccounts = [
    { username: 'superadmin', role: 'SUPER_ADMIN', color: 'danger' },
    { username: 'corporate1', role: 'CORPORATE', color: 'info' },
    { username: 'branch1', role: 'BRANCH', color: 'warning' }
  ];

  return (
    <div className="admin-login-container">
      <div className="admin-background">
        <Container className="d-flex align-items-center justify-content-center min-vh-100">
          <Row className="w-100 justify-content-center">
            <Col md={6} lg={5} xl={4}>
              <Card className="admin-card shadow-lg border-0">
                <Card.Body className="p-4">
                  {/* Admin Header */}
                  <div className="text-center mb-4">
                    <div className="admin-logo mb-3">
                      <div className="logo-circle bg-danger text-white">
                        🔐
                      </div>
                    </div>
                    <h4 className="text-danger">Admin</h4>
                  </div>

                  {/* Login Form */}
                  <Form onSubmit={handleSubmit}>
                    {error && <Alert variant="danger">{error}</Alert>}

                    <Form.Group className="mb-3">
                      <Form.Label>Admin Username</Form.Label>
                      <Form.Control
                        type="text"
                        name="username"
                        placeholder="Enter admin username"
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
                        variant="danger"
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
                            Authenticating...
                          </>
                        ) : (
                          'Admin Login'
                        )}
                      </Button>
                    </div>
                  </Form>

                  {/* Demo Accounts */}
                  {/* <div className="mt-4">
                    <h6 className="text-center text-muted mb-3">Demo Admin Accounts</h6>
                    <div className="demo-accounts">
                      {adminAccounts.map((account, index) => (
                        <div key={index} className="demo-account mb-2 p-2 bg-light rounded">
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <strong>{account.username}</strong>
                              <br />
                              <Badge bg={account.color} className="mt-1">
                                {account.role.replace('_', ' ')}
                              </Badge>
                            </div>
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={() => setCredentials({
                                username: account.username,
                                password: 'password123'
                              })}
                              disabled={loading}
                            >
                              Use
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <small className="text-muted d-block text-center mt-2">
                      Password for all demo accounts: <code>password123</code>
                    </small>
                  </div> */}

                  {/* Back to User Login */}
                  <div className="text-center mt-4">
                    <small>
                      <a href="/" className="text-muted text-decoration-none">
                        ← Back to User Login
                      </a>
                    </small>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default AdminLogin;
