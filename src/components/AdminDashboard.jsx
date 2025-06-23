import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Table, Badge, Modal, Alert } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import CountryManagement from './CountryManagement';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const { currentUser, logout } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'continent', 'country', 'state', 'district'
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Mock data for continents, countries, states, districts
  const [continents, setContinents] = useState([
    { id: 1, name: 'Asia', code: 'AS', order: 1, status: true },
    { id: 2, name: 'Africa', code: 'AF', order: 2, status: true },
    { id: 3, name: 'Europe', code: 'EU', order: 3, status: true },
    { id: 4, name: 'North America', code: 'NA', order: 4, status: true },
    { id: 5, name: 'South America', code: 'SA', order: 5, status: true },
    { id: 6, name: 'Oceania', code: 'OC', order: 6, status: true }
  ]);

  const [countries, setCountries] = useState([
    { id: 1, name: 'India', code: 'IN', continentId: 1, order: 1, status: true },
    { id: 2, name: 'United States', code: 'US', continentId: 4, order: 2, status: true },
    { id: 3, name: 'United Kingdom', code: 'UK', continentId: 3, order: 3, status: true },
    { id: 4, name: 'Canada', code: 'CA', continentId: 4, order: 4, status: true }
  ]);

  const [states, setStates] = useState([
    { id: 1, name: 'Karnataka', code: 'KA', countryId: 1, order: 1, status: true },
    { id: 2, name: 'Maharashtra', code: 'MH', countryId: 1, order: 2, status: true },
    { id: 3, name: 'Tamil Nadu', code: 'TN', countryId: 1, order: 3, status: true },
    { id: 4, name: 'Delhi', code: 'DL', countryId: 1, order: 4, status: true },
    { id: 5, name: 'Gujarat', code: 'GJ', countryId: 1, order: 5, status: true }
  ]);

  const [districts, setDistricts] = useState([
    { id: 1, name: 'Bangalore Urban', code: 'BU', stateId: 1, order: 1, status: true },
    { id: 2, name: 'Mysore', code: 'MY', stateId: 1, order: 2, status: true },
    { id: 3, name: 'Mumbai', code: 'MU', stateId: 2, order: 1, status: true },
    { id: 4, name: 'Pune', code: 'PU', stateId: 2, order: 2, status: true }
  ]);

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'profile', label: 'Profile' },
    { id: 'country-list', label: 'Country List', hasSubmenu: true },
    { id: 'create-category', label: 'Create Category' },
    { id: 'my-ads', label: 'My Ads'},
    { id: 'corporate-login', label: 'Corporate Login' },
    { id: 'logout', label: 'Logout'}
  ];

  const countrySubmenu = [
    { id: 'continent', label: 'Continent', parent: 'country-list' },
    { id: 'country', label: 'Country', parent: 'country-list' },
    { id: 'state', label: 'State', parent: 'country-list' },
    { id: 'district', label: 'District', parent: 'country-list' }
  ];

  const handleSidebarClick = (itemId) => {
    if (itemId === 'logout') {
      logout();
      return;
    }
    setActiveSection(itemId);
  };

  const handleAddNew = (type) => {
    setModalType(type);
    setFormData({});
    setShowModal(true);
    setError('');
    setSuccess('');
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    const newItem = {
      id: Date.now(),
      ...formData,
      order: 0,
      status: true
    };

    switch (modalType) {
      case 'continent':
        setContinents([...continents, newItem]);
        break;
      case 'country':
        setCountries([...countries, newItem]);
        break;
      case 'state':
        setStates([...states, newItem]);
        break;
      case 'district':
        setDistricts([...districts, newItem]);
        break;
    }

    setSuccess(`${modalType} added successfully!`);
    setShowModal(false);
    setFormData({});
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const toggleStatus = (type, id) => {
    switch (type) {
      case 'continent':
        setContinents(continents.map(item => 
          item.id === id ? { ...item, status: !item.status } : item
        ));
        break;
      case 'country':
        setCountries(countries.map(item => 
          item.id === id ? { ...item, status: !item.status } : item
        ));
        break;
      case 'state':
        setStates(states.map(item => 
          item.id === id ? { ...item, status: !item.status } : item
        ));
        break;
      case 'district':
        setDistricts(districts.map(item => 
          item.id === id ? { ...item, status: !item.status } : item
        ));
        break;
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div>
            <h2>Dashboard</h2>
            <Row>
              <Col md={3}>
                <Card className="text-center">
                  <Card.Body>
                    <h3>{continents.length}</h3>
                    <p>Continents</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="text-center">
                  <Card.Body>
                    <h3>{countries.length}</h3>
                    <p>Countries</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="text-center">
                  <Card.Body>
                    <h3>{states.length}</h3>
                    <p>States</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="text-center">
                  <Card.Body>
                    <h3>{districts.length}</h3>
                    <p>Districts</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>
        );

      case 'continent':
        return (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2>Add Continent</h2>
              <Button variant="primary" onClick={() => handleAddNew('continent')}>
                Add New Continent
              </Button>
            </div>
            
            <Card>
              <Card.Header>
                <h5>Continent List</h5>
              </Card.Header>
              <Card.Body>
                <Table responsive>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Continent Name</th>
                      <th>Continent Code</th>
                      <th>Order</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {continents.map((continent, index) => (
                      <tr key={continent.id}>
                        <td>{index + 1}</td>
                        <td>{continent.name}</td>
                        <td>{continent.code}</td>
                        <td>
                          <input 
                            type="number" 
                            value={continent.order} 
                            className="form-control form-control-sm"
                            style={{ width: '60px' }}
                            readOnly
                          />
                        </td>
                        <td>
                          <Form.Check 
                            type="switch"
                            checked={continent.status}
                            onChange={() => toggleStatus('continent', continent.id)}
                          />
                        </td>
                        <td>
                          <Button variant="outline-warning" size="sm" className="me-1">
                            ✏️
                          </Button>
                          <Button variant="outline-danger" size="sm">
                            🗑️
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </div>
        );

      case 'country':
        return <CountryManagement />;

      case 'state':
        return (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2>Add State</h2>
              <Button variant="primary" onClick={() => handleAddNew('state')}>
                Add New State
              </Button>
            </div>

            <Card>
              <Card.Header>
                <h5>State List</h5>
              </Card.Header>
              <Card.Body>
                <Table responsive>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>State Name</th>
                      <th>State Code</th>
                      <th>Country</th>
                      <th>Order</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {states.map((state, index) => (
                      <tr key={state.id}>
                        <td>{index + 1}</td>
                        <td>{state.name}</td>
                        <td>{state.code}</td>
                        <td>{countries.find(c => c.id === state.countryId)?.name}</td>
                        <td>
                          <input
                            type="number"
                            value={state.order}
                            className="form-control form-control-sm"
                            style={{ width: '60px' }}
                            readOnly
                          />
                        </td>
                        <td>
                          <Form.Check
                            type="switch"
                            checked={state.status}
                            onChange={() => toggleStatus('state', state.id)}
                          />
                        </td>
                        <td>
                          <Button variant="outline-warning" size="sm" className="me-1">
                            ✏️
                          </Button>
                          <Button variant="outline-danger" size="sm">
                            🗑️
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </div>
        );

      case 'district':
        return (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2>Add District</h2>
              <Button variant="primary" onClick={() => handleAddNew('district')}>
                Add New District
              </Button>
            </div>

            <Card>
              <Card.Header>
                <h5>District List</h5>
              </Card.Header>
              <Card.Body>
                <Table responsive>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>District Name</th>
                      <th>District Code</th>
                      <th>State</th>
                      <th>Order</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {districts.map((district, index) => (
                      <tr key={district.id}>
                        <td>{index + 1}</td>
                        <td>{district.name}</td>
                        <td>{district.code}</td>
                        <td>{states.find(s => s.id === district.stateId)?.name}</td>
                        <td>
                          <input
                            type="number"
                            value={district.order}
                            className="form-control form-control-sm"
                            style={{ width: '60px' }}
                            readOnly
                          />
                        </td>
                        <td>
                          <Form.Check
                            type="switch"
                            checked={district.status}
                            onChange={() => toggleStatus('district', district.id)}
                          />
                        </td>
                        <td>
                          <Button variant="outline-warning" size="sm" className="me-1">
                            ✏️
                          </Button>
                          <Button variant="outline-danger" size="sm">
                            🗑️
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </div>
        );

      default:
        return <div><h2>Welcome to Admin Dashboard</h2></div>;
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="d-flex">
        {/* Sidebar */}
        <div className="admin-sidebar">
          <div className="sidebar-header">
            <h4>admin</h4>
          </div>
          
          <div className="sidebar-menu">
            {sidebarItems.map(item => (
              <div key={item.id}>
                <div 
                  className={`menu-item ${activeSection === item.id ? 'active' : ''}`}
                  onClick={() => handleSidebarClick(item.id)}
                >
                  <span className="menu-label">{item.label}</span>
                  {item.hasSubmenu && <span className="submenu-arrow">▼</span>}
                </div>
                
                {item.id === 'country-list' && (
                  <div className="submenu">
                    {countrySubmenu.map(subItem => (
                      <div 
                        key={subItem.id}
                        className={`submenu-item ${activeSection === subItem.id ? 'active' : ''}`}
                        onClick={() => setActiveSection(subItem.id)}
                      >
                        <span className="submenu-label">{subItem.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="admin-content">
          <div className="content-header">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span>Dashboard</span>
                <span className="mx-2">|</span>
                <span>Document</span>
              </div>
              <div>
                <span>Welcome, {currentUser?.name || currentUser?.username}</span>
              </div>
            </div>
          </div>
          
          <div className="content-body">
            {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}
            {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
            
            {renderContent()}
          </div>
        </div>
      </div>

      {/* Add Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add {modalType}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleFormSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>{modalType} Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleInputChange}
                    placeholder={`Enter ${modalType} name`}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Code</Form.Label>
                  <Form.Control
                    type="text"
                    name="code"
                    value={formData.code || ''}
                    onChange={handleInputChange}
                    placeholder={`Enter ${modalType} code`}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            
            {modalType === 'country' && (
              <Form.Group className="mb-3">
                <Form.Label>Continent</Form.Label>
                <Form.Select
                  name="continentId"
                  value={formData.continentId || ''}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Continent</option>
                  {continents.map(continent => (
                    <option key={continent.id} value={continent.id}>
                      {continent.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            )}
            
            {modalType === 'state' && (
              <Form.Group className="mb-3">
                <Form.Label>Country</Form.Label>
                <Form.Select
                  name="countryId"
                  value={formData.countryId || ''}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Country</option>
                  {countries.map(country => (
                    <option key={country.id} value={country.id}>
                      {country.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            )}
            
            {modalType === 'district' && (
              <Form.Group className="mb-3">
                <Form.Label>State</Form.Label>
                <Form.Select
                  name="stateId"
                  value={formData.stateId || ''}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select State</option>
                  {states.map(state => (
                    <option key={state.id} value={state.id}>
                      {state.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleFormSubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
