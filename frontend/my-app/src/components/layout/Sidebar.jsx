// components/layout/Sidebar.jsx
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import '../../styles/components.css';

const Sidebar = () => {
  const { user } = useContext(AuthContext);

  return (
    <aside className="sidebar">
      <div className="sidebar-menu">
        {/* Common Links */}
        <Link to="/" className="sidebar-link">
          Dashboard
        </Link>
        
        <Link to="/update-profile" className="sidebar-link">
          Update Profile
        </Link>
        
        <Link to="/user-profile" className="sidebar-link">
          My Profile
        </Link>

        {/* Owner Only Links */}
        {user?.role === 'owner' && (
          <>
            <div className="sidebar-section">Owner Menu</div>
            <Link to="/create-owner" className="sidebar-link">
              Create Owner
            </Link>
            <Link to="/create-staff" className="sidebar-link">
              Create Staff
            </Link>
            <Link to="/manage-users" className="sidebar-link">
              Manage Users
            </Link>
          </>
        )}

        {/* Admin Links (Admin can see these, Owner can also see them) */}
        {(user?.role === 'admin' || user?.role === 'owner') && (
          <>
            <div className="sidebar-section">Admin Menu</div>
            <Link to="/create-staff" className="sidebar-link">
              Create Staff
            </Link>
            <Link to="/manage-users" className="sidebar-link">
              Manage Users
            </Link>
            <Link to="/admin-dashboard" className="sidebar-link">
              Admin Dashboard
            </Link>
          </>
        )}

        {/* Owner Dashboard Link (Owner only) */}
        {user?.role === 'owner' && (
          <Link to="/owner-dashboard" className="sidebar-link">
            Owner Dashboard
          </Link>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;