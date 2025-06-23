import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Badge, Offcanvas } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const DefaultDashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [showSidebar, setShowSidebar] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleCloseSidebar = () => setShowSidebar(false);
  const handleShowSidebar = () => setShowSidebar(true);

  const userStats = {
    totalLogins: 45,
    lastLogin: '2024-01-18 10:30 AM',
    accountStatus: 'Active',
    memberSince: '2023-06-15'
  };

  const getQuickActions = () => {
    const baseActions = [
      { title: 'Profile Settings', icon: '👤', color: 'primary', action: () => setShowProfileModal(true) },
      { title: 'Security', icon: '🔒', color: 'warning', action: () => {} },
      { title: 'Notifications', icon: '🔔', color: 'info', action: () => {} },
      { title: 'Help & Support', icon: '❓', color: 'success', action: () => {} }
    ];

    // Add role-specific actions
    if (currentUser?.role === 'SUPER_ADMIN') {
      baseActions.unshift({ title: 'Admin Panel', icon: '⚙️', color: 'danger', action: () => navigate('/super-admin') });
    } else if (currentUser?.role === 'CORPORATE') {
      baseActions.unshift({ title: 'Corporate Panel', icon: '🏢', color: 'info', action: () => navigate('/corporate') });
    } else if (currentUser?.role === 'BRANCH') {
      baseActions.unshift({ title: 'Branch Panel', icon: '🏪', color: 'warning', action: () => navigate('/branch') });
    }

    return baseActions;
  };

  const quickActions = getQuickActions();

  const recentActivities = [
    { action: 'Profile Updated', time: '2 hours ago', type: 'info' },
    { action: 'Password Changed', time: '1 day ago', type: 'warning' },
    { action: 'Login from new device', time: '3 days ago', type: 'success' },
    { action: 'Account verified', time: '1 week ago', type: 'primary' }
  ];

  return (
    <div className={`dashboard-container ${darkMode ? 'dark-mode' : ''}`}>
      <Navbar />
      
      {/* Header Section */}
      <div className="bg-gradient-primary text-white py-4">
        <Container>
          <Row className="align-items-center">
            <Col md={8}>
              <div className="d-flex align-items-center">
                <div className="user-avatar me-3">
                  <div className="avatar-circle bg-white text-primary">
                    {currentUser?.name?.charAt(0) || 'U'}
                  </div>
                </div>
                <div>
                  <h3 className="mb-1">Welcome, {currentUser?.name || 'User'}</h3>
                  <p className="mb-0 opacity-75">
                    ID: {currentUser?.id?.slice(0, 10) || '8884284844'} |
                    Role: <Badge bg="light" text="dark" className="ms-1">{currentUser?.role || 'USER'}</Badge>
                  </p>
                  <small className="opacity-50">
                    {currentUser?.role === 'SUPER_ADMIN' && 'System Administrator - Full Access'}
                    {currentUser?.role === 'CORPORATE' && 'Corporate Manager - Manage Branch Users'}
                    {currentUser?.role === 'BRANCH' && 'Branch User - Access Branch Operations'}
                    {!currentUser?.role && 'Standard User Access'}
                  </small>
                </div>
              </div>
            </Col>
            <Col md={4} className="text-end">
              <Button variant="outline-light" onClick={handleShowSidebar}>
                <i className="bi bi-list"></i> Menu
              </Button>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="mt-4">
        {/* Stats Cards */}
        <Row className="mb-4">
          <Col md={3} className="mb-3">
            <Card className="stat-card border-0 shadow-sm">
              <Card.Body className="text-center">
                <div className="stat-icon text-primary mb-2">📊</div>
                <h4 className="text-primary">{userStats.totalLogins}</h4>
                <p className="text-muted mb-0">Total Logins</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} className="mb-3">
            <Card className="stat-card border-0 shadow-sm">
              <Card.Body className="text-center">
                <div className="stat-icon text-success mb-2">✅</div>
                <h6 className="text-success">{userStats.accountStatus}</h6>
                <p className="text-muted mb-0">Account Status</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} className="mb-3">
            <Card className="stat-card border-0 shadow-sm">
              <Card.Body className="text-center">
                <div className="stat-icon text-info mb-2">🕒</div>
                <small className="text-info">{userStats.lastLogin}</small>
                <p className="text-muted mb-0">Last Login</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} className="mb-3">
            <Card className="stat-card border-0 shadow-sm">
              <Card.Body className="text-center">
                <div className="stat-icon text-warning mb-2">📅</div>
                <small className="text-warning">{userStats.memberSince}</small>
                <p className="text-muted mb-0">Member Since</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Quick Actions */}
        <Row className="mb-4">
          <Col>
            <h5 className="mb-3">Quick Actions</h5>
            <Row>
              {quickActions.map((action, index) => (
                <Col md={3} key={index} className="mb-3">
                  <Card 
                    className="action-card border-0 shadow-sm h-100 cursor-pointer"
                    onClick={action.action}
                  >
                    <Card.Body className="text-center">
                      <div className="action-icon mb-2" style={{ fontSize: '2rem' }}>
                        {action.icon}
                      </div>
                      <h6 className={`text-${action.color}`}>{action.title}</h6>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>

        {/* Recent Activities */}
        <Row>
          <Col md={8}>
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-transparent">
                <h5 className="mb-0">Recent Activities</h5>
              </Card.Header>
              <Card.Body>
                {recentActivities.map((activity, index) => (
                  <div key={index} className="activity-item d-flex align-items-center mb-3">
                    <div className={`activity-dot bg-${activity.type} me-3`}></div>
                    <div className="flex-grow-1">
                      <p className="mb-0">{activity.action}</p>
                      <small className="text-muted">{activity.time}</small>
                    </div>
                  </div>
                ))}
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-transparent">
                <h5 className="mb-0">Account Info</h5>
              </Card.Header>
              <Card.Body>
                <div className="info-item mb-3">
                  <strong>Email:</strong>
                  <p className="mb-0 text-muted">{currentUser?.email || 'Not provided'}</p>
                </div>
                <div className="info-item mb-3">
                  <strong>Role:</strong>
                  <p className="mb-0">
                    <Badge bg="primary">{currentUser?.role || 'USER'}</Badge>
                  </p>
                </div>
                <div className="info-item mb-3">
                  <strong>Location:</strong>
                  <p className="mb-0 text-muted">India / Karnataka / Bengaluru Urban</p>
                </div>
                <Button variant="outline-primary" size="sm" className="w-100">
                  Edit Profile
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Sidebar */}
      <Offcanvas show={showSidebar} onHide={handleCloseSidebar} placement="end">
        <Offcanvas.Header closeButton className="bg-primary text-white">
          <Offcanvas.Title>My Group</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="p-0">
          <div className="sidebar-menu">
            <div className="menu-item p-3 border-bottom">
              <strong>Home</strong>
            </div>
            <div className="menu-item p-3 border-bottom d-flex justify-content-between align-items-center">
              <span>Dark / Light Mode</span>
              <Form.Check 
                type="switch"
                checked={darkMode}
                onChange={(e) => setDarkMode(e.target.checked)}
              />
            </div>
            <div className="menu-item p-3 border-bottom">
              <div className="d-flex align-items-center">
                <span className="me-2">📍</span>
                <div>
                  <strong>Set Location</strong>
                  <br />
                  <small className="text-muted">India / Karnataka / Bengaluru Urban</small>
                </div>
              </div>
            </div>
            <div className="menu-item p-3 border-bottom">⚙️ Settings</div>
            <div className="menu-item p-3 border-bottom">📋 Legal</div>
            <div className="menu-item p-3 border-bottom">❓ Help & Support</div>
            <div className="menu-item p-3 border-bottom">📱 Share App</div>
            <div className="menu-item p-3 border-bottom">📥 Download Apps</div>
            <div className="menu-item p-3 border-bottom">📞 Contact Us</div>
            <div className="menu-item p-3 border-bottom">⭐ Reviews and Ratings</div>
            <div className="menu-item p-3 text-danger" onClick={logout} style={{ cursor: 'pointer' }}>
              🚪 Logout
            </div>
          </div>
          
          {/* Social Media Links */}
          <div className="p-3 mt-auto">
            <h6 className="text-center mb-3">Follow us</h6>
            <div className="d-flex justify-content-center gap-2">
              <Button variant="primary" size="sm">🌐</Button>
              <Button variant="danger" size="sm">📺</Button>
              <Button variant="primary" size="sm">📘</Button>
              <Button variant="danger" size="sm">📷</Button>
              <Button variant="info" size="sm">🐦</Button>
              <Button variant="primary" size="sm">💼</Button>
            </div>
          </div>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Profile Modal */}
      <Modal show={showProfileModal} onHide={() => setShowProfileModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Profile Settings</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control type="text" defaultValue={currentUser?.name} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" defaultValue={currentUser?.email} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control type="tel" placeholder="Enter phone number" />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowProfileModal(false)}>
            Cancel
          </Button>
          <Button variant="primary">
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DefaultDashboard;
