// components/dashboard/AdminDashboard.jsx
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';
import '../../styles/dashboard.css';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalRevenue: 0,
    monthlyGrowth: 0,
    userStats: [],
    recentUsers: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      // Mock data - replace with actual API calls
      setDashboardData({
        totalUsers: 156,
        activeUsers: 124,
        totalRevenue: 24500,
        monthlyGrowth: 15.5,
        userStats: [
          { role: 'user', count: 120, percentage: 76 },
          { role: 'staff', count: 25, percentage: 16 },
          { role: 'admin', count: 8, percentage: 5 },
          { role: 'owner', count: 3, percentage: 2 }
        ],
        recentUsers: [
          { id: 1, name: 'John Doe', email: 'john@example.com', role: 'user', status: 'active' },
          { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'admin', status: 'active' },
          { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'staff', status: 'inactive' },
          { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'user', status: 'active' }
        ]
      });
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStaff = () => {
    window.location.href = '/create-staff';
  };

  const handleManageUsers = () => {
    window.location.href = '/manage-users';
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Admin Dashboard</h1>
          <p className="dashboard-subtitle">Welcome back, {user?.name}! Here's what's happening.</p>
        </div>
        <div className="header-actions">
          <button className="btn-primary" onClick={handleCreateStaff}>
            Create Staff
          </button>
          <button className="btn-secondary" onClick={handleManageUsers}>
            Manage Users
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="stats-grid">
        <div className="stat-card admin-stat">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>Total Users</h3>
            <p className="stat-value">{dashboardData.totalUsers}</p>
            <div className="stat-trend positive">
              <span>↑ {dashboardData.monthlyGrowth}% this month</span>
            </div>
          </div>
        </div>

        <div className="stat-card admin-stat">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>Active Users</h3>
            <p className="stat-value">{dashboardData.activeUsers}</p>
            <p className="stat-description">
              {Math.round((dashboardData.activeUsers / dashboardData.totalUsers) * 100)}% active rate
            </p>
          </div>
        </div>

        <div className="stat-card admin-stat">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>Total Revenue</h3>
            <p className="stat-value">${dashboardData.totalRevenue.toLocaleString()}</p>
            <div className="stat-trend positive">
              <span>↑ 12% from last month</span>
            </div>
          </div>
        </div>

        <div className="stat-card admin-stat">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>System Health</h3>
            <p className="stat-value">98%</p>
            <div className="health-indicator">
              <div className="health-bar">
                <div className="health-fill" style={{ width: '98%' }}></div>
              </div>
              <span className="health-text">Optimal</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="dashboard-content">
        <div className="content-grid admin-grid">
          {/* User Distribution Chart */}
          <div className="content-card wide-card">
            <div className="card-header">
              <h3>User Distribution by Role</h3>
              <select className="chart-filter">
                <option>Last 30 days</option>
                <option>Last 90 days</option>
                <option>This year</option>
              </select>
            </div>
            <div className="distribution-chart">
              {dashboardData.userStats.map(stat => (
                <div key={stat.role} className="distribution-item">
                  <div className="distribution-bar-container">
                    <div 
                      className="distribution-bar" 
                      style={{ height: `${stat.percentage}%` }}
                      data-role={stat.role}
                    ></div>
                  </div>
                  <div className="distribution-info">
                    <span className="distribution-label">{stat.role}</span>
                    <span className="distribution-value">{stat.count} users</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Users Table */}
          <div className="content-card">
            <div className="card-header">
              <h3>Recent Users</h3>
              <button className="btn-text">View All →</button>
            </div>
            <div className="table-container">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.recentUsers.map(user => (
                    <tr key={user.id}>
                      <td>
                        <div className="user-cell">
                          <div className="user-avatar">{user.name.charAt(0)}</div>
                          <div>
                            <div className="user-name">{user.name}</div>
                            <div className="user-email">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`role-badge ${user.role}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${user.status}`}>
                          {user.status}
                        </span>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button className="action-btn edit" title="Edit">✏️</button>
                          <button className="action-btn delete" title="Delete">🗑️</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* System Actions */}
          <div className="content-card">
            <h3>System Actions</h3>
            <div className="system-actions">
              <button className="system-action-btn">
                <span className="action-icon">🔄</span>
                <div>
                  <strong>Run Backup</strong>
                  <p>Create system backup</p>
                </div>
              </button>
              <button className="system-action-btn">
                <span className="action-icon">📧</span>
                <div>
                  <strong>Send Announcement</strong>
                  <p>Broadcast message to all users</p>
                </div>
              </button>
              <button className="system-action-btn">
                <span className="action-icon">📊</span>
                <div>
                  <strong>Generate Reports</strong>
                  <p>Export system analytics</p>
                </div>
              </button>
              <button className="system-action-btn">
                <span className="action-icon">🔧</span>
                <div>
                  <strong>System Settings</strong>
                  <p>Configure platform settings</p>
                </div>
              </button>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="content-card">
            <h3>Recent System Activity</h3>
            <div className="timeline">
              <div className="timeline-item">
                <div className="timeline-dot success"></div>
                <div className="timeline-content">
                  <p>New staff member created</p>
                  <span className="timeline-time">10 minutes ago</span>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-dot info"></div>
                <div className="timeline-content">
                  <p>System backup completed</p>
                  <span className="timeline-time">2 hours ago</span>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-dot warning"></div>
                <div className="timeline-content">
                  <p>High server load detected</p>
                  <span className="timeline-time">5 hours ago</span>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-dot success"></div>
                <div className="timeline-content">
                  <p>10 new users registered</p>
                  <span className="timeline-time">1 day ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;