import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import DashboardLayout from './components/DashboardLayout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import CourseCatalog from './pages/CourseCatalog';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public login/register page */}
          <Route path="/login" element={<Login />} />

          {/* Protected Portal Routes */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/users"
            element={
              <PrivateRoute allowedRoles={['ADMIN']}>
                <DashboardLayout>
                  <UserManagement />
                </DashboardLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/courses"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <CourseCatalog />
                </DashboardLayout>
              </PrivateRoute>
            }
          />

          {/* Redirect to dashboard */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
