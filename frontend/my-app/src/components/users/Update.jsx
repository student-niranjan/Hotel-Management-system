// components/users/UpdateProfile.jsx
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';
import '../../styles/components.css';

const UpdateProfile = () => {
  const { user, updateProfile } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    bio: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [activeTab, setActiveTab] = useState('personal');

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        bio: user.bio || ''
      }));
      
      // Set profile image if exists
      if (user.profileImage) {
        setPreviewImage(user.profileImage);
      }
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitPersonal = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const profileData = {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        bio: formData.bio
      };

      // Add profile image if selected
      if (profileImage) {
        const formDataWithImage = new FormData();
        Object.keys(profileData).forEach(key => {
          formDataWithImage.append(key, profileData[key]);
        });
        formDataWithImage.append('profileImage', profileImage);
        
        // Upload image
        const uploadResponse = await api.post('/auth/upload-profile-image', formDataWithImage, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        profileData.profileImage = uploadResponse.data.imageUrl;
      }

      const result = await updateProfile(profileData);
      
      if (result.success) {
        setMessage('Profile updated successfully!');
        
        // Update local form data
        setFormData(prev => ({
          ...prev,
          phone: profileData.phone,
          address: profileData.address,
          bio: profileData.bio
        }));
      } else {
        setError(result.error || 'Failed to update profile');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitPassword = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    setMessage('');
    setError('');

    try {
      const passwordData = {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      };

      const result = await api.put('/auth/change-password', passwordData);
      
      if (result.data.success) {
        setMessage('Password changed successfully!');
        
        // Clear password fields
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
      } else {
        setError(result.data.message || 'Failed to change password');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Current password is incorrect');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: '👤' },
    { id: 'password', label: 'Change Password', icon: '🔒' },
    { id: 'preferences', label: 'Preferences', icon: '⚙️' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' }
  ];

  return (
    <div className="update-profile-container">
      <div className="profile-header">
        <h1>Update Profile</h1>
        <p className="subtitle">Manage your account settings and preferences</p>
      </div>

      <div className="profile-content">
        {/* Left Sidebar */}
        <div className="profile-sidebar">
          <div className="profile-summary">
            <div className="profile-image-container">
              <div className="profile-image">
                {previewImage ? (
                  <img src={previewImage} alt="Profile" />
                ) : (
                  <div className="profile-initials">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                )}
              </div>
              <label className="change-photo-btn">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
                <span>Change Photo</span>
              </label>
            </div>
            
            <div className="profile-info">
              <h3>{user?.name}</h3>
              <p className="user-email">{user?.email}</p>
              <div className={`role-badge ${user?.role}`}>
                {user?.role}
              </div>
              <p className="member-since">
                Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long' 
                }) : 'N/A'}
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="profile-nav">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Right Content */}
        <div className="profile-details">
          {message && <div className="alert success">{message}</div>}
          {error && <div className="alert error">{error}</div>}

          {/* Personal Info Tab */}
          {activeTab === 'personal' && (
            <form onSubmit={handleSubmitPersonal}>
              <div className="section-header">
                <h3>Personal Information</h3>
                <p className="section-subtitle">Update your personal details</p>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="disabled-input"
                  />
                  <p className="field-note">Email cannot be changed</p>
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                  />
                </div>

                <div className="form-group">
                  <label>Role</label>
                  <input
                    type="text"
                    value={user?.role || ''}
                    disabled
                    className="disabled-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your address"
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell us about yourself..."
                  rows="4"
                  maxLength="200"
                />
                <div className="char-counter">
                  {formData.bio.length}/200 characters
                </div>
              </div>

              <div className="form-actions">
                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Save Changes'}
                </button>
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      name: user?.name || '',
                      phone: user?.phone || '',
                      address: user?.address || '',
                      bio: user?.bio || ''
                    }));
                  }}
                >
                  Reset Changes
                </button>
              </div>
            </form>
          )}

          {/* Change Password Tab */}
          {activeTab === 'password' && (
            <form onSubmit={handleSubmitPassword}>
              <div className="section-header">
                <h3>Change Password</h3>
                <p className="section-subtitle">Update your password for enhanced security</p>
              </div>

              <div className="password-form">
                <div className="form-group">
                  <label>Current Password *</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    required
                    placeholder="Enter current password"
                  />
                </div>

                <div className="form-group">
                  <label>New Password *</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    required
                    placeholder="Enter new password"
                  />
                  <div className="password-requirements">
                    <p className="requirement-title">Password must:</p>
                    <ul>
                      <li className={formData.newPassword.length >= 6 ? 'valid' : ''}>
                        Be at least 6 characters long
                      </li>
                      <li className={/[A-Z]/.test(formData.newPassword) ? 'valid' : ''}>
                        Contain at least one uppercase letter
                      </li>
                      <li className={/[0-9]/.test(formData.newPassword) ? 'valid' : ''}>
                        Contain at least one number
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="form-group">
                  <label>Confirm New Password *</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder="Confirm new password"
                  />
                  {formData.newPassword && formData.confirmPassword && (
                    <div className={`password-match ${formData.newPassword === formData.confirmPassword ? 'match' : 'no-match'}`}>
                      {formData.newPassword === formData.confirmPassword 
                        ? '✓ Passwords match' 
                        : '✗ Passwords do not match'}
                    </div>
                  )}
                </div>

                <div className="form-actions">
                  <button 
                    type="submit" 
                    className="btn-primary"
                    disabled={loading || !formData.currentPassword || !formData.newPassword || !formData.confirmPassword}
                  >
                    {loading ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="preferences-tab">
              <div className="section-header">
                <h3>Account Preferences</h3>
                <p className="section-subtitle">Customize your experience</p>
              </div>

              <div className="preferences-list">
                <div className="preference-item">
                  <div className="preference-info">
                    <h4>Language</h4>
                    <p>Choose your preferred language</p>
                  </div>
                  <select className="preference-select">
                    <option>English</option>
                    <option>Spanish</option>
                    <option>French</option>
                    <option>German</option>
                  </select>
                </div>

                <div className="preference-item">
                  <div className="preference-info">
                    <h4>Timezone</h4>
                    <p>Set your local timezone</p>
                  </div>
                  <select className="preference-select">
                    <option>UTC-05:00 Eastern Time</option>
                    <option>UTC-06:00 Central Time</option>
                    <option>UTC-07:00 Mountain Time</option>
                    <option>UTC-08:00 Pacific Time</option>
                  </select>
                </div>

                <div className="preference-item">
                  <div className="preference-info">
                    <h4>Theme</h4>
                    <p>Choose light or dark mode</p>
                  </div>
                  <div className="theme-switch">
                    <button className="theme-option active">Light</button>
                    <button className="theme-option">Dark</button>
                  </div>
                </div>

                <div className="preference-item">
                  <div className="preference-info">
                    <h4>Email Digest</h4>
                    <p>Receive daily/weekly updates</p>
                  </div>
                  <label className="switch">
                    <input type="checkbox" defaultChecked />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="preference-item">
                  <div className="preference-info">
                    <h4>Two-Factor Authentication</h4>
                    <p>Add an extra layer of security</p>
                  </div>
                  <label className="switch">
                    <input type="checkbox" />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>

              <div className="form-actions">
                <button className="btn-primary">Save Preferences</button>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="notifications-tab">
              <div className="section-header">
                <h3>Notification Settings</h3>
                <p className="section-subtitle">Manage how you receive notifications</p>
              </div>

              <div className="notification-categories">
                <div className="notification-category">
                  <h4>Email Notifications</h4>
                  <div className="notification-options">
                    <div className="notification-option">
                      <span>Account Activity</span>
                      <label className="switch">
                        <input type="checkbox" defaultChecked />
                        <span className="slider"></span>
                      </label>
                    </div>
                    <div className="notification-option">
                      <span>Security Alerts</span>
                      <label className="switch">
                        <input type="checkbox" defaultChecked />
                        <span className="slider"></span>
                      </label>
                    </div>
                    <div className="notification-option">
                      <span>Marketing Emails</span>
                      <label className="switch">
                        <input type="checkbox" />
                        <span className="slider"></span>
                      </label>
                    </div>
                    <div className="notification-option">
                      <span>Product Updates</span>
                      <label className="switch">
                        <input type="checkbox" defaultChecked />
                        <span className="slider"></span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="notification-category">
                  <h4>Push Notifications</h4>
                  <div className="notification-options">
                    <div className="notification-option">
                      <span>New Messages</span>
                      <label className="switch">
                        <input type="checkbox" defaultChecked />
                        <span className="slider"></span>
                      </label>
                    </div>
                    <div className="notification-option">
                      <span>Task Reminders</span>
                      <label className="switch">
                        <input type="checkbox" defaultChecked />
                        <span className="slider"></span>
                      </label>
                    </div>
                    <div className="notification-option">
                      <span>System Updates</span>
                      <label className="switch">
                        <input type="checkbox" />
                        <span className="slider"></span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="notification-category">
                  <h4>SMS Notifications</h4>
                  <div className="notification-options">
                    <div className="notification-option">
                      <span>Security Codes</span>
                      <label className="switch">
                        <input type="checkbox" defaultChecked />
                        <span className="slider"></span>
                      </label>
                    </div>
                    <div className="notification-option">
                      <span>Transaction Alerts</span>
                      <label className="switch">
                        <input type="checkbox" />
                        <span className="slider"></span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button className="btn-primary">Save Notification Settings</button>
                <button className="btn-secondary">Mute All</button>
              </div>
            </div>
          )}

          {/* Danger Zone */}
          <div className="danger-zone">
            <h4>Danger Zone</h4>
            <p>Permanently delete your account and all associated data</p>
            <button className="btn-danger">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;