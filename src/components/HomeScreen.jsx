import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const HomeScreen = () => {
  const apps = [
    { name: 'Mychat', icon: '💬', color: '#4CAF50' },
    { name: 'Mygo', icon: '🚗', color: '#2196F3' },
    { name: 'Myneedy', icon: '🛒', color: '#FF9800' },
    { name: 'Mydiary', icon: '📔', color: '#9C27B0' },
    { name: 'Myjoy', icon: '🎮', color: '#F44336' },
    { name: 'Mymedia', icon: '📺', color: '#E91E63' },
    { name: 'Myunions', icon: '👥', color: '#607D8B' },
    { name: 'Myshop', icon: '🛍️', color: '#795548' }
  ];

  const handleAppClick = (appName) => {
    // Handle app navigation
    console.log(`Opening ${appName}`);
  };

  return (
    <div className="home-screen">
      {/* Top Navigation Bar */}
      <div className="top-nav">
        <Container fluid>
          <Row className="align-items-center py-2">
            <Col xs={2}>
              <div className="nav-icon">
                <div className="menu-grid">
                  <div className="grid-dot"></div>
                  <div className="grid-dot"></div>
                  <div className="grid-dot"></div>
                  <div className="grid-dot"></div>
                  <div className="grid-dot"></div>
                  <div className="grid-dot"></div>
                  <div className="grid-dot"></div>
                  <div className="grid-dot"></div>
                  <div className="grid-dot"></div>
                </div>
                <span className="nav-label">More</span>
              </div>
            </Col>
            <Col xs={8}>
              <div className="top-apps-row">
                {apps.slice(0, 6).map((app, index) => (
                  <div key={index} className="top-app-item">
                    <div className="top-app-icon" style={{ backgroundColor: app.color }}>
                      {app.icon}
                    </div>
                    <span className="top-app-label">{app.name}</span>
                  </div>
                ))}
              </div>
            </Col>
            <Col xs={2} className="text-end">
              <div className="profile-section">
                <div className="profile-icon">
                  <div className="profile-avatar">MG</div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Main Content Area */}
      <div className="main-content">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6}>
              {/* Purple Background Section */}
              <div className="apps-section">
                <div className="apps-container">
                  {apps.map((app, index) => (
                    <div 
                      key={index} 
                      className="app-button"
                      onClick={() => handleAppClick(app.name)}
                    >
                      <div className="app-icon" style={{ backgroundColor: app.color }}>
                        {app.icon}
                      </div>
                      <span className="app-name">{app.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default HomeScreen;
