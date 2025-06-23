import React from 'react';
import { Navbar as BootstrapNavbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'danger';
      case 'CORPORATE':
        return 'info';
      case 'BRANCH':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'Super Admin';
      case 'CORPORATE':
        return 'Corporate';
      case 'BRANCH':
        return 'Branch';
      default:
        return role;
    }
  };

  return (
    <BootstrapNavbar bg="dark" variant="dark" expand="lg">
      <Container>
        <BootstrapNavbar.Brand href="#home">
          Role-Based Auth System
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link onClick={() => navigate('/')}>Home</Nav.Link>
            {currentUser?.role === 'SUPER_ADMIN' && (
              <Nav.Link onClick={() => navigate('/super-admin')}>Admin Panel</Nav.Link>
            )}
            {currentUser?.role === 'CORPORATE' && (
              <Nav.Link onClick={() => navigate('/corporate')}>Corporate Panel</Nav.Link>
            )}
            {currentUser?.role === 'BRANCH' && (
              <Nav.Link onClick={() => navigate('/branch')}>Branch Panel</Nav.Link>
            )}
          </Nav>
          <Nav>
            <NavDropdown 
              title={
                <span>
                  {currentUser?.name} 
                  <span className={`badge bg-${getRoleBadgeColor(currentUser?.role)} ms-2`}>
                    {getRoleDisplayName(currentUser?.role)}
                  </span>
                </span>
              } 
              id="basic-nav-dropdown"
            >
              <NavDropdown.Item href="#profile">Profile</NavDropdown.Item>
              <NavDropdown.Item href="#settings">Settings</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout}>
                Logout
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
