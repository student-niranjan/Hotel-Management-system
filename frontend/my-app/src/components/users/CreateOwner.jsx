// components/users/CreateOwner.jsx
import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import '../../styles/components.css';

const CreateOwner = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { createOwner } = useContext(AuthContext);

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
    
    const ownerData = {
      name: formData.name,
      email: formData.email,
      password: formData.password
    };
    
    const result = await createOwner(ownerData);
    if (result.success) {
      setMessage('Owner created successfully!');
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
    } else {
      setError(result.error || 'Failed to create owner');
    }
  };

  return (
    <div className="dashboard-content">
      <h1>Create New Owner</h1>
      <p className="subtitle">Only accessible by Owners</p>
      
      <div className="form-container">
        {message && <div className="alert success">{message}</div>}
        {error && <div className="alert error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Owner Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter owner's full name"
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
              placeholder="Enter owner's email"
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Create a password for owner"
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
            Create Owner
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateOwner;