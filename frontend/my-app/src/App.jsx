import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext.jsx';
import Navbar from './components/layout/Navbar.jsx';
import Sidebar from './components/layout/Sidebar.jsx';
import Login from './components/auth/Login.jsx';
import Register from './components/auth/Register.jsx';
import ForgotPassword from './components/auth/ForgotPassword.jsx';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';
import AdminDashboard from './components/dashboard/AdminDashboard.jsx';
import OwnerDashboard from './components/dashboard/OwnerDashboard.jsx';
import UserDashboard from './components/dashboard/UserDashboard.jsx';
import CreateOwner from './components/users/CreateOwner.jsx';
import CreateStaff from './components/users/CreateStaff.jsx';
import UpdateProfile from './components/users/Update.jsx';
import './styles/App.css';

const AppContent = () => {
  const { user } = useContext(AuthContext);
  
  return (
    <Router>
      <div className="app">
        <Navbar />
        <div className="app-content">
          {user && <Sidebar />}
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              
              {/* Protected Routes */}
              <Route path="/" element={
                <ProtectedRoute>
                  {user?.role === 'owner' ? <OwnerDashboard /> : 
                   user?.role === 'admin' ? <AdminDashboard /> : 
                   <UserDashboard />}
                </ProtectedRoute>
              } />
              
              <Route path="/admin-dashboard" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/owner-dashboard" element={
                <ProtectedRoute allowedRoles={['owner']}>
                  <OwnerDashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/create-owner" element={
                <ProtectedRoute allowedRoles={['owner']}>
                  <CreateOwner />
                </ProtectedRoute>
              } />
              
              <Route path="/create-staff" element={
                <ProtectedRoute allowedRoles={['owner', 'admin']}>
                  <CreateStaff />
                </ProtectedRoute>
              } />
              
              <Route path="/update-profile" element={
                <ProtectedRoute allowedRoles={['user', 'admin', 'owner']}>
                  <UpdateProfile />
                </ProtectedRoute>
              } />
              
              <Route path="/manage-users" element={
                <ProtectedRoute allowedRoles={['owner', 'admin']}>
                  <div className="manage-users">
                    <h1>Manage Users</h1>
                    <p>This page is accessible to Owner & Admin only</p>
                  </div>
                </ProtectedRoute>
              } />
              
              <Route path="/user-profile" element={
                <ProtectedRoute allowedRoles={['user', 'admin', 'owner']}>
                  <div className="user-profile">
                    <h1>User Profile</h1>
                    <p>User Profile Accessed</p>
                  </div>
                </ProtectedRoute>
              } />
              
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;