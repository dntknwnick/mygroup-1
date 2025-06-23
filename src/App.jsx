import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthPage from './components/AuthPage';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import DefaultDashboard from './components/DefaultDashboard';
import SuperAdminDashboard from './components/SuperAdminDashboard';
import CorporateDashboard from './components/CorporateDashboard';
import BranchDashboard from './components/BranchDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import HomScreen from './components/HomeScreen';

// Component to handle root route redirection
const RootRedirect = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <AuthPage />;
  }

  // Show default dashboard for all authenticated users
  return <HomScreen />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Root route - Auth Page (Login/Register) */}
            <Route path="/" element={<RootRedirect />} />

            {/* Admin Login Route */}
            <Route path="/admin" element={<AdminLogin />} />

            {/* New Admin Dashboard Route */}
            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'CORPORATE', 'BRANCH']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Default Dashboard for authenticated users */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DefaultDashboard />
                </ProtectedRoute>
              }
            />

            {/* Super Admin Dashboard */}
            <Route
              path="/super-admin"
              element={
                <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                  <SuperAdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Corporate Dashboard */}
            <Route
              path="/corporate"
              element={
                <ProtectedRoute allowedRoles={['CORPORATE']}>
                  <CorporateDashboard />
                </ProtectedRoute>
              }
            />

            {/* Branch Dashboard */}
            <Route
              path="/branch"
              element={
                <ProtectedRoute allowedRoles={['BRANCH']}>
                  <BranchDashboard />
                </ProtectedRoute>
              }
            />

            {/* Catch all route - redirect to root */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
