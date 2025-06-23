import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Table, Badge, Modal, Alert, Spinner } from 'react-bootstrap';
import '../styles/CountryManagement.css';

const CountryManagement = () => {
  const [countries, setCountries] = useState([]);
  const [continents, setContinents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add'); // 'add' or 'edit'
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    continent_id: '',
    name: '',
    code: '',
    currency: '',
    flag_image: '',
    iso_code: '',
    nationality: '',
    display_order: 0,
    is_active: true
  });

  // Fetch data on component mount
  useEffect(() => {
    fetchContinents();
    fetchCountries();
  }, []);

  const fetchContinents = async () => {
    try {
      const response = await fetch('/api/continents');
      const result = await response.json();
      if (result.success) {
        setContinents(result.data);
      } else {
        setError('Failed to fetch continents');
      }
    } catch (error) {
      console.error('Error fetching continents:', error);
      setError('Failed to fetch continents');
    }
  };

  const fetchCountries = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/countries');
      const result = await response.json();
      if (result.success) {
        setCountries(result.data);
      } else {
        setError('Failed to fetch countries');
      }
    } catch (error) {
      console.error('Error fetching countries:', error);
      setError('Failed to fetch countries');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          flag_image: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setFormData({
      continent_id: '',
      name: '',
      code: '',
      currency: '',
      flag_image: '',
      iso_code: '',
      nationality: '',
      display_order: 0,
      is_active: true
    });
    setSelectedCountry(null);
    setError('');
    setSuccess('');
  };

  const handleAddNew = () => {
    resetForm();
    setModalType('add');
    setShowModal(true);
  };

  const handleEdit = (country) => {
    setFormData({
      continent_id: country.continent_id,
      name: country.name,
      code: country.code,
      currency: country.currency || '',
      flag_image: country.flag_image || '',
      iso_code: country.iso_code || '',
      nationality: country.nationality || '',
      display_order: country.display_order || 0,
      is_active: country.is_active
    });
    setSelectedCountry(country);
    setModalType('edit');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const url = modalType === 'add' ? '/api/countries' : `/api/countries/${selectedCountry.id}`;
      const method = modalType === 'add' ? 'POST' : 'PUT';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(`Country ${modalType === 'add' ? 'created' : 'updated'} successfully!`);
        setShowModal(false);
        fetchCountries(); // Refresh the list
        resetForm();
      } else {
        setError(result.error || 'Operation failed');
      }
    } catch (error) {
      console.error('Error saving country:', error);
      setError('Failed to save country');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (countryId) => {
    if (!window.confirm('Are you sure you want to delete this country?')) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/countries/${countryId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        setSuccess('Country deleted successfully!');
        fetchCountries(); // Refresh the list
      } else {
        setError(result.error || 'Failed to delete country');
      }
    } catch (error) {
      console.error('Error deleting country:', error);
      setError('Failed to delete country');
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (countryId, currentStatus) => {
    const country = countries.find(c => c.id === countryId);
    if (!country) return;

    try {
      const updatedData = { ...country, is_active: !currentStatus };
      const response = await fetch(`/api/countries/${countryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      const result = await response.json();

      if (result.success) {
        fetchCountries(); // Refresh the list
      } else {
        setError(result.error || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      setError('Failed to update status');
    }
  };

  return (
    <Container fluid className="country-management">
      <Row>
        <Col>
          {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
          {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}
          
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Country Management</h5>
              <Button variant="primary" onClick={handleAddNew}>
                Add Country
              </Button>
            </Card.Header>
            <Card.Body>
              {loading ? (
                <div className="text-center">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </div>
              ) : (
                <Table responsive striped hover>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Continent Name</th>
                      <th>Country Name</th>
                      <th>Country Code</th>
                      <th>Currency</th>
                      <th>Country Flag</th>
                      <th>ISO Code</th>
                      <th>Nationality</th>
                      <th>Order</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {countries.map((country, index) => (
                      <tr key={country.id}>
                        <td>{index + 1}</td>
                        <td>{country.continent_name}</td>
                        <td>{country.name}</td>
                        <td>{country.code}</td>
                        <td>{country.currency}</td>
                        <td>
                          {country.flag_image ? (
                            <img
                              src={country.flag_image}
                              alt={`${country.name} flag`}
                              className="flag-image"
                            />
                          ) : (
                            <span className="text-muted">No flag</span>
                          )}
                        </td>
                        <td>{country.iso_code}</td>
                        <td>{country.nationality}</td>
                        <td>
                          <input 
                            type="number" 
                            value={country.display_order} 
                            className="form-control form-control-sm"
                            style={{ width: '60px' }}
                            readOnly
                          />
                        </td>
                        <td>
                          <Form.Check 
                            type="switch"
                            checked={country.is_active}
                            onChange={() => toggleStatus(country.id, country.is_active)}
                          />
                        </td>
                        <td>
                          <Button 
                            variant="outline-warning" 
                            size="sm" 
                            className="me-1"
                            onClick={() => handleEdit(country)}
                          >
                            ✏️
                          </Button>
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                            onClick={() => handleDelete(country.id)}
                          >
                            🗑️
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Add/Edit Country Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{modalType === 'add' ? 'Add Country' : 'Edit Country'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Continent <span className="text-danger">*</span></Form.Label>
                  <Form.Select
                    name="continent_id"
                    value={formData.continent_id}
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
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Country <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter country name"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Code <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    placeholder="Enter country code (e.g., IND)"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Currency</Form.Label>
                  <Form.Control
                    type="text"
                    name="currency"
                    value={formData.currency}
                    onChange={handleInputChange}
                    placeholder="Enter currency (e.g., INR)"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Country Flag</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  {formData.flag_image && (
                    <div className="mt-2">
                      <img
                        src={formData.flag_image}
                        alt="Flag preview"
                        className="flag-preview"
                      />
                    </div>
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>ISO Code</Form.Label>
                  <Form.Control
                    type="text"
                    name="iso_code"
                    value={formData.iso_code}
                    onChange={handleInputChange}
                    placeholder="Enter ISO code (e.g., +91)"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nationality</Form.Label>
                  <Form.Control
                    type="text"
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleInputChange}
                    placeholder="Enter nationality (e.g., Indian)"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Display Order</Form.Label>
                  <Form.Control
                    type="number"
                    name="display_order"
                    value={formData.display_order}
                    onChange={handleInputChange}
                    min="0"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleInputChange}
                    label="Active"
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  {modalType === 'add' ? 'Adding...' : 'Updating...'}
                </>
              ) : (
                modalType === 'add' ? 'Add Country' : 'Update Country'
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default CountryManagement;
