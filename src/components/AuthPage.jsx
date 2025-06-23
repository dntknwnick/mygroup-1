import React, { useState } from 'react';
import { Nav, Modal } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import Login from './Login';
import Register from './Register';
import HomeScreen from './HomeScreen';

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [showAuthModal, setShowAuthModal] = useState(true);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const { currentUser } = useAuth();

  // If user is logged in, show home screen
  if (currentUser) {
    return <HomeScreen />;
  }

  return (
    <div className="auth-page-container">
      {/* Show Home Screen in background */}
      <HomeScreen />

      {/* Auth Modal Overlay */}
      <Modal
        show={showAuthModal}
        onHide={() => setShowAuthModal(false)}
        size="md"
        centered
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header className="border-0 pb-0">
          <div className="w-100 text-center">
            <div className="brand-logo">
              <div className="logo-circle bg-primary text-white mx-auto mb-3">
                MG
              </div>
              <h4 className="mb-1">My Group</h4>
              <p className="text-muted small">Welcome to your digital community</p>
            </div>
          </div>
        </Modal.Header>
        <Modal.Body className="pt-0">
          {/* Tab Navigation */}
          <Nav variant="pills" className="auth-tabs mb-4" fill>
            <Nav.Item>
              <Nav.Link
                active={activeTab === 'login'}
                onClick={() => {
                  setActiveTab('login');
                  setShowRegisterModal(false);
                }}
                className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
              >
                Login
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                active={activeTab === 'register'}
                onClick={() => {
                  setActiveTab('register');
                  setShowRegisterModal(true);
                }}
                className={`auth-tab ${activeTab === 'register' ? 'active' : ''}`}
              >
                Register
              </Nav.Link>
            </Nav.Item>
          </Nav>

          {/* Show Login form when not in register mode */}
          {!showRegisterModal && <Login onLoginSuccess={() => setShowAuthModal(false)} />}

          {/* Admin Login Link */}
          {/* <div className="text-center mt-4">
            <small className="text-muted">
              Admin? <a href="/admin" className="text-primary">Login here</a>
            </small>
          </div> */}
        </Modal.Body>
      </Modal>

      {/* Registration Modal */}
      <Modal
        show={showRegisterModal}
        onHide={() => {
          setShowRegisterModal(false);
          setActiveTab('login');
        }}
        size="lg"
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Create Your Account</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          <Register onRegistrationComplete={() => {
            setShowRegisterModal(false);
            setShowAuthModal(false);
          }} />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AuthPage;
