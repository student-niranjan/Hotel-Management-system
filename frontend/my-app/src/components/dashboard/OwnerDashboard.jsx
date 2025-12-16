// components/dashboard/OwnerDashboard.jsx
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';
import '../../styles/dashboard.css';

const OwnerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [ownerData, setOwnerData] = useState({
    platformStats: {
      totalRevenue: 0,
      monthlyGrowth: 0,
      activeSubscriptions: 0,
      churnRate: 0
    },
    userManagement: {
      totalUsers: 0,
      newUsers: 0,
      admins: 0,
      owners: 0
    },
    financialOverview: {
      monthlyRevenue: [],
      topPlans: []
    },
    systemHealth: {
      uptime: 0,
      performance: 0,
      securityScore: 0
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOwnerData();
  }, []);

  const fetchOwnerData = async () => {
    try {
      // Mock data - replace with actual API calls
      setOwnerData({
        platformStats: {
          totalRevenue: 125000,
          monthlyGrowth: 22.5,
          activeSubscriptions: 895,
          churnRate: 2.3
        },
        userManagement: {
          totalUsers: 1560,
          newUsers: 156,
          admins: 8,
          owners: 3
        },
        financialOverview: {
          monthlyRevenue: [
            { month: 'Jan', revenue: 10000 },
            { month: 'Feb', revenue: 12000 },
            { month: 'Mar', revenue: 15000 },
            { month: 'Apr', revenue: 18000 },
            { month: 'May', revenue: 22000 },
            { month: 'Jun', revenue: 28000 }
          ],
          topPlans: [
            { plan: 'Enterprise', users: 450, revenue: 67500 },
            { plan: 'Professional', users: 300, revenue: 45000 },
            { plan: 'Basic', users: 145, revenue: 14500 }
          ]
        },
        systemHealth: {
          uptime: 99.9,
          performance: 96.5,
          securityScore: 98.7
        }
      });
    } catch (error) {
      console.error('Error fetching owner data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOwner = () => {
    window.location.href = '/create-owner';
  };

  const handleCreateStaff = () => {
    window.location.href = '/create-staff';
  };

  return (
    <div className="dashboard owner-dashboard">
      {/* Header Section */}
      <div className="dashboard-header owner-header">
        <div>
          <h1>Owner Dashboard</h1>
          <p className="dashboard-subtitle">Complete platform overview and management</p>
        </div>
        <div className="owner-actions">
          <button className="btn-primary" onClick={handleCreateOwner}>
            <span className="btn-icon">👑</span>
            Create Owner
          </button>
          <button className="btn-secondary" onClick={handleCreateStaff}>
            <span className="btn-icon">👥</span>
            Manage Team
          </button>
        </div>
      </div>

      {/* Platform Overview Stats */}
      <div className="stats-grid owner-stats">
        <div className="stat-card owner-stat">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>Total Revenue</h3>
            <p className="stat-value">${ownerData.platformStats.totalRevenue.toLocaleString()}</p>
            <div className="stat-trend positive">
              <span>↑ {ownerData.platformStats.monthlyGrowth}% this month</span>
            </div>
          </div>
        </div>

        <div className="stat-card owner-stat">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <h3>Active Subscriptions</h3>
            <p className="stat-value">{ownerData.platformStats.activeSubscriptions}</p>
            <p className="stat-description">
              <span className="positive">↑ 12% growth</span>
              <span className="divider">|</span>
              <span className="negative">↓ {ownerData.platformStats.churnRate}% churn</span>
            </p>
          </div>
        </div>

        <div className="stat-card owner-stat">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>Total Users</h3>
            <p className="stat-value">{ownerData.userManagement.totalUsers}</p>
            <div className="user-breakdown">
              <span className="user-type">Owners: {ownerData.userManagement.owners}</span>
              <span className="user-type">Admins: {ownerData.userManagement.admins}</span>
              <span className="user-type">New: {ownerData.userManagement.newUsers}</span>
            </div>
          </div>
        </div>

        <div className="stat-card owner-stat">
          <div className="stat-icon">🛡️</div>
          <div className="stat-content">
            <h3>System Health</h3>
            <div className="health-metrics">
              <div className="health-metric">
                <span className="metric-label">Uptime:</span>
                <span className="metric-value">{ownerData.systemHealth.uptime}%</span>
              </div>
              <div className="health-metric">
                <span className="metric-label">Performance:</span>
                <span className="metric-value">{ownerData.systemHealth.performance}%</span>
              </div>
              <div className="health-metric">
                <span className="metric-label">Security:</span>
                <span className="metric-value">{ownerData.systemHealth.securityScore}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="dashboard-content">
        <div className="content-grid owner-grid">
          {/* Revenue Chart */}
          <div className="content-card wide-card">
            <div className="card-header">
              <h3>Revenue Growth</h3>
              <select className="chart-filter">
                <option>Last 6 months</option>
                <option>Last year</option>
                <option>All time</option>
              </select>
            </div>
            <div className="revenue-chart">
              <div className="chart-bars">
                {ownerData.financialOverview.monthlyRevenue.map((month, index) => {
                  const maxRevenue = Math.max(...ownerData.financialOverview.monthlyRevenue.map(m => m.revenue));
                  const height = (month.revenue / maxRevenue) * 100;
                  return (
                    <div key={index} className="chart-bar-container">
                      <div 
                        className="chart-bar" 
                        style={{ height: `${height}%` }}
                        title={`$${month.revenue.toLocaleString()}`}
                      >
                        <div className="chart-bar-value">${(month.revenue / 1000).toFixed(0)}K</div>
                      </div>
                      <span className="chart-label">{month.month}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Subscription Plans */}
          <div className="content-card">
            <h3>Subscription Plans Performance</h3>
            <div className="plans-grid">
              {ownerData.financialOverview.topPlans.map((plan, index) => (
                <div key={index} className="plan-card">
                  <div className="plan-header">
                    <h4>{plan.plan}</h4>
                    <span className="plan-users">{plan.users} users</span>
                  </div>
                  <div className="plan-revenue">
                    <span className="revenue-label">Revenue:</span>
                    <span className="revenue-value">${plan.revenue.toLocaleString()}</span>
                  </div>
                  <div className="plan-progress">
                    <div 
                      className="progress-bar" 
                      style={{ 
                        width: `${(plan.revenue / ownerData.platformStats.totalRevenue) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* User Management */}
          <div className="content-card">
            <div className="card-header">
              <h3>User Management</h3>
              <button className="btn-text">Manage All →</button>
            </div>
            <div className="user-management-actions">
              <button className="management-btn" onClick={handleCreateOwner}>
                <span className="btn-icon">👑</span>
                <div>
                  <strong>Add Owner</strong>
                  <p>Create new platform owner</p>
                </div>
              </button>
              <button className="management-btn" onClick={handleCreateStaff}>
                <span className="btn-icon">👔</span>
                <div>
                  <strong>Add Admin</strong>
                  <p>Create new administrator</p>
                </div>
              </button>
              <button className="management-btn">
                <span className="btn-icon">📊</span>
                <div>
                  <strong>Analytics</strong>
                  <p>View detailed reports</p>
                </div>
              </button>
              <button className="management-btn">
                <span className="btn-icon">⚙️</span>
                <div>
                  <strong>Settings</strong>
                  <p>Platform configuration</p>
                </div>
              </button>
            </div>
          </div>

          {/* System Controls */}
          <div className="content-card">
            <h3>System Controls</h3>
            <div className="system-controls">
              <div className="control-item">
                <label className="switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider"></span>
                </label>
                <div className="control-info">
                  <strong>Maintenance Mode</strong>
                  <p>Restrict user access</p>
                </div>
              </div>
              <div className="control-item">
                <label className="switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider"></span>
                </label>
                <div className="control-info">
                  <strong>Auto Backup</strong>
                  <p>Daily system backup</p>
                </div>
              </div>
              <div className="control-item">
                <label className="switch">
                  <input type="checkbox" />
                  <span className="slider"></span>
                </label>
                <div className="control-info">
                  <strong>Email Notifications</strong>
                  <p>Send system alerts</p>
                </div>
              </div>
              <div className="control-item">
                <label className="switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider"></span>
                </label>
                <div className="control-info">
                  <strong>Two-Factor Auth</strong>
                  <p>Require for all users</p>
                </div>
              </div>
            </div>
            <div className="control-actions">
              <button className="btn-warning">Emergency Stop</button>
              <button className="btn-danger">Reset System</button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Stats */}
      <div className="dashboard-footer">
        <div className="footer-stats">
          <div className="footer-stat">
            <span className="footer-label">Server Uptime</span>
            <span className="footer-value">{ownerData.systemHealth.uptime}%</span>
          </div>
          <div className="footer-stat">
            <span className="footer-label">Active Sessions</span>
            <span className="footer-value">142</span>
          </div>
          <div className="footer-stat">
            <span className="footer-label">API Calls (24h)</span>
            <span className="footer-value">24.5K</span>
          </div>
          <div className="footer-stat">
            <span className="footer-label">Storage Used</span>
            <span className="footer-value">78%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;