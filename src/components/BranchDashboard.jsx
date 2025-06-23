import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Modal, Form } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import Navbar from './Navbar';

const BranchDashboard = () => {
  const { currentUser } = useAuth();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileData, setProfileData] = useState({
    name: currentUser.name,
    username: currentUser.username
  });

  // Mock data for branch operations
  const [transactions] = useState([
    { id: 1, type: 'Deposit', amount: 5000, customer: 'John Doe', date: '2024-01-15' },
    { id: 2, type: 'Withdrawal', amount: 2000, customer: 'Jane Smith', date: '2024-01-15' },
    { id: 3, type: 'Transfer', amount: 1500, customer: 'Bob Johnson', date: '2024-01-14' },
  ]);

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    // In a real app, this would update the user profile
    setShowProfileModal(false);
  };

  const totalDeposits = transactions
    .filter(t => t.type === 'Deposit')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalWithdrawals = transactions
    .filter(t => t.type === 'Withdrawal')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="dashboard-container">
      <Navbar />
      <Container className="mt-4">
        <Row>
          <Col>
            <h2>Branch Dashboard</h2>
            <p className="text-muted">Welcome, {currentUser.name}</p>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col md={3}>
            <Card className="card-shadow">
              <Card.Body className="text-center">
                <h3 className="text-success">${totalDeposits.toLocaleString()}</h3>
                <p className="mb-0">Total Deposits</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="card-shadow">
              <Card.Body className="text-center">
                <h3 className="text-danger">${totalWithdrawals.toLocaleString()}</h3>
                <p className="mb-0">Total Withdrawals</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="card-shadow">
              <Card.Body className="text-center">
                <h3 className="text-info">{transactions.length}</h3>
                <p className="mb-0">Transactions Today</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="card-shadow">
              <Card.Body className="text-center">
                <Button 
                  variant="outline-primary" 
                  className="btn-custom"
                  onClick={() => setShowProfileModal(true)}
                >
                  Update Profile
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col md={6}>
            <Card className="card-shadow">
              <Card.Header>
                <h5 className="mb-0">Quick Actions</h5>
              </Card.Header>
              <Card.Body>
                <div className="d-grid gap-2">
                  <Button variant="primary" size="lg">Process Deposit</Button>
                  <Button variant="warning" size="lg">Process Withdrawal</Button>
                  <Button variant="info" size="lg">Account Inquiry</Button>
                  <Button variant="secondary" size="lg">Generate Report</Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="card-shadow">
              <Card.Header>
                <h5 className="mb-0">Branch Information</h5>
              </Card.Header>
              <Card.Body>
                <Table borderless>
                  <tbody>
                    <tr>
                      <td><strong>Branch Code:</strong></td>
                      <td>BR001</td>
                    </tr>
                    <tr>
                      <td><strong>Manager:</strong></td>
                      <td>{currentUser.name}</td>
                    </tr>
                    <tr>
                      <td><strong>Location:</strong></td>
                      <td>Main Street Branch</td>
                    </tr>
                    <tr>
                      <td><strong>Status:</strong></td>
                      <td><Badge bg="success">Active</Badge></td>
                    </tr>
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col>
            <Card className="card-shadow">
              <Card.Header>
                <h5 className="mb-0">Recent Transactions</h5>
              </Card.Header>
              <Card.Body>
                <Table responsive striped>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Type</th>
                      <th>Customer</th>
                      <th>Amount</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map(transaction => (
                      <tr key={transaction.id}>
                        <td>#{transaction.id}</td>
                        <td>
                          <Badge 
                            bg={transaction.type === 'Deposit' ? 'success' : 
                                transaction.type === 'Withdrawal' ? 'danger' : 'info'}
                          >
                            {transaction.type}
                          </Badge>
                        </td>
                        <td>{transaction.customer}</td>
                        <td>${transaction.amount.toLocaleString()}</td>
                        <td>{transaction.date}</td>
                        <td><Badge bg="success">Completed</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Profile Update Modal */}
        <Modal show={showProfileModal} onHide={() => setShowProfileModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Update Profile</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleProfileUpdate}>
              <Form.Group className="mb-3">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  value={profileData.username}
                  onChange={(e) => setProfileData({...profileData, username: e.target.value})}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowProfileModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleProfileUpdate}>
              Update Profile
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default BranchDashboard;
