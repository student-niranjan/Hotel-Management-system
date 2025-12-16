// components/dashboard/UserDashboard.jsx
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';
import '../../styles/dashboard.css';

const UserDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      // Mock data - replace with actual API calls
      setStats({
        totalTasks: 15,
        completedTasks: 10,
        pendingTasks: 5,
        recentActivity: [
          { id: 1, action: 'Profile updated', timestamp: '2 hours ago' },
          { id: 2, action: 'Task completed', timestamp: '1 day ago' },
          { id: 3, action: 'Logged in', timestamp: '2 days ago' }
        ]
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const completionPercentage = stats.totalTasks > 0 
    ? Math.round((stats.completedTasks / stats.totalTasks) * 100) 
    : 0;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome, {user?.name}!</h1>
        <p className="user-role-badge">{user?.role.toUpperCase()}</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon user-stat">👤</div>
          <div className="stat-content">
            <h3>Profile Status</h3>
            <p className="stat-value">Complete</p>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '100%' }}></div>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon task-stat">📋</div>
          <div className="stat-content">
            <h3>Total Tasks</h3>
            <p className="stat-value">{stats.totalTasks}</p>
            <p className="stat-description">Assigned to you</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon completed-stat">✅</div>
          <div className="stat-content">
            <h3>Completed</h3>
            <p className="stat-value">{stats.completedTasks}</p>
            <p className="stat-description">Tasks done</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon pending-stat">⏳</div>
          <div className="stat-content">
            <h3>Pending</h3>
            <p className="stat-value">{stats.pendingTasks}</p>
            <p className="stat-description">Tasks remaining</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="content-grid">
          {/* Progress Chart */}
          <div className="content-card">
            <h3>Task Completion</h3>
            <div className="completion-chart">
              <div className="completion-circle">
                <div className="circle-progress" style={{ '--progress': `${completionPercentage}%` }}>
                  <span>{completionPercentage}%</span>
                </div>
              </div>
              <div className="completion-details">
                <div className="completion-item">
                  <span className="completion-dot completed"></span>
                  <span>Completed: {stats.completedTasks}</span>
                </div>
                <div className="completion-item">
                  <span className="completion-dot pending"></span>
                  <span>Pending: {stats.pendingTasks}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="content-card">
            <h3>Recent Activity</h3>
            <div className="activity-list">
              {stats.recentActivity.map(activity => (
                <div key={activity.id} className="activity-item">
                  <div className="activity-icon">⚡</div>
                  <div className="activity-content">
                    <p>{activity.action}</p>
                    <span className="activity-time">{activity.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="content-card">
            <h3>Quick Actions</h3>
            <div className="quick-actions">
              <button className="quick-action-btn" onClick={() => window.location.href = '/update-profile'}>
                <span className="action-icon">✏️</span>
                Update Profile
              </button>
              <button className="quick-action-btn">
                <span className="action-icon">🔔</span>
                Notifications
              </button>
              <button className="quick-action-btn">
                <span className="action-icon">📤</span>
                Export Data
              </button>
              <button className="quick-action-btn">
                <span className="action-icon">⚙️</span>
                Settings
              </button>
            </div>
          </div>

          {/* User Info */}
          <div className="content-card">
            <h3>Account Information</h3>
            <div className="user-info-details">
              <div className="info-row">
                <span className="info-label">Name:</span>
                <span className="info-value">{user?.name}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Email:</span>
                <span className="info-value">{user?.email}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Role:</span>
                <span className="info-value role-badge">{user?.role}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Member Since:</span>
                <span className="info-value">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;