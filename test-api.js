// Simple test script to verify API is working
const testAPI = async () => {
  try {
    console.log('Testing API health...');
    const healthResponse = await fetch('http://localhost:3001/api/health');
    const healthData = await healthResponse.json();
    console.log('Health check:', healthData);

    console.log('\nTesting login...');
    const loginResponse = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'superadmin',
        password: 'password123'
      })
    });
    
    const loginData = await loginResponse.json();
    console.log('Login result:', loginData);

  } catch (error) {
    console.error('API test failed:', error);
  }
};

testAPI();
