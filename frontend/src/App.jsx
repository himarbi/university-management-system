import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import DashboardLayout from './components/DashboardLayout';

// Pages & Components
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import CourseCatalog from './pages/CourseCatalog';
import StudentTranscript from './pages/StudentTranscript';
import TeacherGradingPortal from './pages/TeacherGradingPortal';
import AttendanceManager from './pages/AttendanceManager';
import FeeManager from './pages/FeeManager';
import AnnouncementsWidget from './components/AnnouncementsWidget';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public login/register page */}
          <Route path="/login" element={<Login />} />

          {/* Protected Dedicated Portal Routes */}
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
            path="/courses"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <CourseCatalog />
                </DashboardLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/transcript"
            element={
              <PrivateRoute allowedRoles={['STUDENT', 'ADMIN']}>
                <DashboardLayout>
                  <StudentTranscript />
                </DashboardLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/attendance"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <AttendanceManager />
                </DashboardLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/fees"
            element={
              <PrivateRoute allowedRoles={['STUDENT', 'ADMIN']}>
                <DashboardLayout>
                  <FeeManager />
                </DashboardLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/grading"
            element={
              <PrivateRoute allowedRoles={['TEACHER', 'ADMIN']}>
                <DashboardLayout>
                  <TeacherGradingPortal />
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
            path="/announcements"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <AnnouncementsWidget fullPage={true} />
                </DashboardLayout>
              </PrivateRoute>
            }
          />

          {/* Fallback Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
