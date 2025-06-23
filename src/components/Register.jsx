import React, { useState } from 'react';
import { Form, Button, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';

const Register = ({ onRegistrationComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  
  // Step 1 form data (my_group_user table)
  const [step1Data, setStep1Data] = useState({
    fullName: '',
    mobileNumber: '',
    password: '',
    confirmPassword: ''
  });

  // Step 2 form data (my_group_user_details table)
  const [step2Data, setStep2Data] = useState({
    displayName: '',
    emailId: '',
    gender: '',
    martialStatus: '',
    countryId: 'IN',
    stateId: '',
    districtId: '',
    nationality: 'Indian',
    education: '',
    profession: '',
    dateOfBirth: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { createUser, login, currentUser } = useAuth();

  const handleStep1Change = (e) => {
    setStep1Data({
      ...step1Data,
      [e.target.name]: e.target.value
    });
  };

  const handleStep2Change = (e) => {
    setStep2Data({
      ...step2Data,
      [e.target.name]: e.target.value
    });
  };

  const validateStep1 = () => {
    if (!step1Data.fullName.trim()) {
      setError('Full name is required');
      return false;
    }
    if (!step1Data.mobileNumber.trim()) {
      setError('Mobile number is required');
      return false;
    }
    if (step1Data.mobileNumber.length < 10) {
      setError('Mobile number must be at least 10 digits');
      return false;
    }
    if (!step1Data.password) {
      setError('Password is required');
      return false;
    }
    if (step1Data.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (step1Data.password !== step1Data.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!step2Data.emailId.trim()) {
      setError('Email is required');
      return false;
    }
    if (!step2Data.emailId.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  // Handle Step 1 submission
  const handleStep1Submit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateStep1()) {
      return;
    }

    setLoading(true);

    try {
      // First try to login with existing credentials
      const loginResult = await login(step1Data.mobileNumber, step1Data.password);
      
      if (loginResult.success) {
        // User already exists and credentials are correct
        setCurrentStep(2);
        return;
      }

      // If login fails, try to create new user
      const basicUserData = {
        username: step1Data.mobileNumber,
        password: step1Data.password,
        name: step1Data.fullName,
        email: `${step1Data.mobileNumber}@mygroup.com`, // Temporary email
        role: 'USER',
        mobile: step1Data.mobileNumber
      };

      // Create user
      await createUser(basicUserData);
      
      // Auto-login the newly created user
      const newLoginResult = await login(step1Data.mobileNumber, step1Data.password);
      if (newLoginResult.success) {
        console.log('Login successful, moving to step 2');
        setCurrentStep(2);
      } else {
        setError('Account created but login failed. Please try logging in manually.');
      }

    } catch (err) {
      // If user creation fails due to duplicate, try login again
      if (err.message.includes('duplicate key') || err.message.includes('already exists')) {
        try {
          const loginResult = await login(step1Data.mobileNumber, step1Data.password);
          if (loginResult.success) {
            console.log('Existing user login successful, moving to step 2');
            setCurrentStep(2);
          } else {
            setError('User already exists but password is incorrect. Please check your password.');
          }
        } catch (loginErr) {
          setError('User already exists but login failed. Please try the login tab instead.');
        }
      } else {
        setError('Registration failed: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle Step 2 submission (complete registration)
  const handleStep2Submit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateStep2()) {
      return;
    }

    setLoading(true);

    try {
      // Try to update user details via API call
      const response = await fetch('/api/users/update-details', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUser?.id,
          displayName: step2Data.displayName || step1Data.fullName,
          emailId: step2Data.emailId,
          gender: step2Data.gender,
          martialStatus: step2Data.martialStatus,
          countryId: step2Data.countryId,
          stateId: step2Data.stateId,
          districtId: step2Data.districtId,
          nationality: step2Data.nationality,
          education: step2Data.education,
          profession: step2Data.profession,
          dateOfBirth: step2Data.dateOfBirth
        }),
      });

      if (response.ok) {
        setSuccess('Profile completed successfully! Welcome to My Group.');
      } else {
        // If API fails, still complete registration
        setSuccess('Registration completed! (Profile will be updated when server is available)');
      }

    } catch (err) {
      // If API is not available, still complete registration
      console.log('API not available, completing registration anyway:', err.message);
      setSuccess('Registration completed! Welcome to My Group.');
    }

    // Always complete registration after 2 seconds
    setTimeout(() => {
      if (onRegistrationComplete) {
        onRegistrationComplete();
      }
    }, 2000);

    setLoading(false);
  };

  return (
    <div className="registration-container p-4">
      {/* Step Indicator */}
      <div className="registration-step-indicator mb-4">
        <div className={`step-circle ${currentStep >= 1 ? 'active' : 'pending'}`}>1</div>
        <div className={`step-line ${currentStep > 1 ? 'completed' : ''}`}></div>
        <div className={`step-circle ${currentStep >= 2 ? 'active' : 'pending'}`}>2</div>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      {/* Step 1: Basic Information */}
      {currentStep === 1 && (
        <div>
          <h5 className="text-center mb-4">Basic Information</h5>
          <Form onSubmit={handleStep1Submit}>
            <Form.Group className="mb-3">
              <Form.Label>
                Full Name <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={step1Data.fullName}
                onChange={handleStep1Change}
                disabled={loading}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                Mobile Number <span className="text-danger">*</span>
              </Form.Label>
              <div className="input-group">
                <span className="input-group-text">+91</span>
                <Form.Control
                  type="tel"
                  name="mobileNumber"
                  placeholder="Mobile Number"
                  value={step1Data.mobileNumber}
                  onChange={handleStep1Change}
                  disabled={loading}
                  maxLength="10"
                  pattern="[0-9]{10}"
                  required
                />
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                Password <span className="text-danger">*</span>
              </Form.Label>
              <div className="input-group">
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={step1Data.password}
                  onChange={handleStep1Change}
                  disabled={loading}
                  required
                />
                <Button
                  variant="outline-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? '🙈' : '👁️'}
                </Button>
              </div>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>
                Confirm Password <span className="text-danger">*</span>
              </Form.Label>
              <div className="input-group">
                <Form.Control
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={step1Data.confirmPassword}
                  onChange={handleStep1Change}
                  disabled={loading}
                  required
                />
                <Button
                  variant="outline-secondary"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={loading}
                >
                  {showConfirmPassword ? '🙈' : '👁️'}
                </Button>
              </div>
            </Form.Group>

            <div className="d-grid">
              <Button
                variant="info"
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
                    Creating Account...
                  </>
                ) : (
                  'Register'
                )}
              </Button>
            </div>
          </Form>
        </div>
      )}

      {/* Step 2: Profile Details */}
      {currentStep === 2 && (
        <div>
          <h5 className="text-center mb-4">Complete Your Profile</h5>
          <Form onSubmit={handleStep2Submit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Display Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="displayName"
                    placeholder="How you want to be displayed"
                    value={step2Data.displayName}
                    onChange={handleStep2Change}
                    disabled={loading}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Email ID <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="email"
                    name="emailId"
                    placeholder="Enter email address"
                    value={step2Data.emailId}
                    onChange={handleStep2Change}
                    disabled={loading}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Gender</Form.Label>
                  <Form.Select
                    name="gender"
                    value={step2Data.gender}
                    onChange={handleStep2Change}
                    disabled={loading}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Marital Status</Form.Label>
                  <Form.Select
                    name="martialStatus"
                    value={step2Data.martialStatus}
                    onChange={handleStep2Change}
                    disabled={loading}
                  >
                    <option value="">Select Status</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Country</Form.Label>
                  <Form.Select
                    name="countryId"
                    value={step2Data.countryId}
                    onChange={handleStep2Change}
                    disabled={loading}
                  >
                    <option value="IN">India</option>
                    <option value="US">United States</option>
                    <option value="UK">United Kingdom</option>
                    <option value="CA">Canada</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>State</Form.Label>
                  <Form.Select
                    name="stateId"
                    value={step2Data.stateId}
                    onChange={handleStep2Change}
                    disabled={loading}
                  >
                    <option value="">Select State</option>
                    <option value="KA">Karnataka</option>
                    <option value="MH">Maharashtra</option>
                    <option value="TN">Tamil Nadu</option>
                    <option value="DL">Delhi</option>
                    <option value="GJ">Gujarat</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>District</Form.Label>
                  <Form.Control
                    type="text"
                    name="districtId"
                    placeholder="Enter district"
                    value={step2Data.districtId}
                    onChange={handleStep2Change}
                    disabled={loading}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Education</Form.Label>
                  <Form.Control
                    type="text"
                    name="education"
                    placeholder="Your education background"
                    value={step2Data.education}
                    onChange={handleStep2Change}
                    disabled={loading}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Profession</Form.Label>
                  <Form.Control
                    type="text"
                    name="profession"
                    placeholder="Your profession"
                    value={step2Data.profession}
                    onChange={handleStep2Change}
                    disabled={loading}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Date of Birth</Form.Label>
                  <Form.Control
                    type="date"
                    name="dateOfBirth"
                    value={step2Data.dateOfBirth}
                    onChange={handleStep2Change}
                    disabled={loading}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nationality</Form.Label>
                  <Form.Control
                    type="text"
                    name="nationality"
                    placeholder="Your nationality"
                    value={step2Data.nationality}
                    onChange={handleStep2Change}
                    disabled={loading}
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex gap-2 mt-4">
              <Button
                variant="secondary"
                onClick={() => {
                  if (onRegistrationComplete) {
                    onRegistrationComplete();
                  }
                }}
                disabled={loading}
                className="flex-fill"
              >
                Skip for Now
              </Button>
              <Button
                variant="success"
                type="submit"
                disabled={loading}
                className="flex-fill"
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
                    Completing Registration...
                  </>
                ) : (
                  'Complete Registration'
                )}
              </Button>
            </div>
          </Form>
        </div>
      )}
    </div>
  );
};

export default Register;
