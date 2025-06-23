import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Alert, Table, Badge } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import Navbar from './Navbar';

const SuperAdminDashboard = () => {
  const { currentUser, createUser, getUsersByCreator } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    email: '',
    role: 'CORPORATE'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [corporateUsers, setCorporateUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load corporate users
  useEffect(() => {
    const loadCorporateUsers = async () => {
      if (currentUser?.id) {
        const users = await getUsersByCreator(currentUser.id);
        setCorporateUsers(users);
      }
    };
    loadCorporateUsers();
  }, [currentUser, getUsersByCreator]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!formData.username || !formData.password || !formData.name) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      const newUser = await createUser(formData);
      setSuccess(`Corporate user "${newUser.name}" created successfully!`);
      setFormData({ username: '', password: '', name: '', email: '', role: 'CORPORATE' });
      setShowModal(false);

      // Reload corporate users
      const users = await getUsersByCreator(currentUser.id);
      setCorporateUsers(users);
    } catch (err) {
      setError('Failed to create user: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({ username: '', password: '', name: '', email: '', role: 'CORPORATE' });
    setError('');
  };

  return (
    <div className="dashboard-container">
      <Navbar />
      <Container className="mt-4">
        <Row>
          <Col>
            <h2>Super Admin Dashboard</h2>
            <p className="text-muted">Welcome, {currentUser.name}</p>
          </Col>
        </Row>

        {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}

        <Row className="mb-4">
          <Col md={4}>
            <Card className="card-shadow">
              <Card.Body className="text-center">
                <h3 className="text-primary">{corporateUsers.length}</h3>
                <p className="mb-0">Corporate Users</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="card-shadow">
              <Card.Body className="text-center">
                <h3 className="text-success">Active</h3>
                <p className="mb-0">System Status</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="card-shadow">
              <Card.Body className="text-center">
                <Button 
                  variant="primary" 
                  className="btn-custom"
                  onClick={() => setShowModal(true)}
                >
                  Create Corporate User
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col>
            <Card className="card-shadow">
              <Card.Header>
                <h5 className="mb-0">Corporate Users</h5>
              </Card.Header>
              <Card.Body>
                {corporateUsers.length === 0 ? (
                  <p className="text-muted text-center">No corporate users created yet.</p>
                ) : (
                  <Table responsive>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {corporateUsers.map(user => (
                        <tr key={user.id}>
                          <td>{user.name}</td>
                          <td>{user.username}</td>
                          <td>{user.email || 'N/A'}</td>
                          <td><Badge bg="info">{user.role}</Badge></td>
                          <td><Badge bg={user.isActive ? 'success' : 'danger'}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </Badge></td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Create User Modal */}
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Create Corporate User</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter full name"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Enter username"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter password"
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              Create User
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default SuperAdminDashboard;
