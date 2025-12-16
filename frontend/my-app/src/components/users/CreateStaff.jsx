// components/users/CreateStaff.jsx
import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import '../../styles/components.css';

const CreateStaff = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'staff'
  });
  
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { createStaff } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    const staffData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role
    };
    
    const result = await createStaff(staffData);
    if (result.success) {
      setMessage('Staff member created successfully!');
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'staff'
      });
    } else {
      setError(result.error || 'Failed to create staff');
    }
  };

  return (
    <div className="dashboard-content">
      <h1>Create Staff Member</h1>
      <p className="subtitle">Accessible by Owners and Admins</p>
      
      <div className="form-container">
        {message && <div className="alert success">{message}</div>}
        {error && <div className="alert error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Staff Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter staff's full name"
            />
          </div>
          
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter staff's email"
            />
          </div>
          
          <div className="form-group">
            <label>Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="form-select"
            >
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Create a password"
            />
          </div>
          
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm the password"
            />
          </div>
          
          <button type="submit" className="btn-primary">
            Create Staff
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateStaff;