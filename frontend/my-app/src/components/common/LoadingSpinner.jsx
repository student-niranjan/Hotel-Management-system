// src/components/common/LoadingSpinner.jsx
import React from 'react';
import '../../styles/common.css';

const LoadingSpinner = ({ size = 'medium', color = 'primary', fullscreen = false }) => {
  const sizeClasses = {
    small: 'spinner-sm',
    medium: 'spinner-md',
    large: 'spinner-lg',
    xlarge: 'spinner-xl'
  };

  const colorClasses = {
    primary: 'spinner-primary',
    secondary: 'spinner-secondary',
    success: 'spinner-success',
    danger: 'spinner-danger',
    warning: 'spinner-warning',
    light: 'spinner-light',
    dark: 'spinner-dark'
  };

  if (fullscreen) {
    return (
      <div className="spinner-overlay">
        <div className={`spinner ${sizeClasses[size]} ${colorClasses[color]}`}></div>
        <p className="spinner-text">Loading...</p>
      </div>
    );
  }

  return (
    <div className="spinner-container">
      <div className={`spinner ${sizeClasses[size]} ${colorClasses[color]}`}></div>
    </div>
  );
};

export const LoadingOverlay = ({ message = 'Loading...', children }) => {
  return (
    <div className="loading-overlay-wrapper">
      {children}
      <div className="loading-overlay">
        <div className="spinner spinner-lg spinner-light"></div>
        {message && <p className="spinner-message">{message}</p>}
      </div>
    </div>
  );
};

export const InlineLoader = ({ text = 'Loading...' }) => {
  return (
    <div className="inline-loader">
      <div className="spinner spinner-sm spinner-primary"></div>
      <span className="loader-text">{text}</span>
    </div>
  );
};

export const SkeletonLoader = ({ type = 'text', count = 1, width = '100%', height = '20px' }) => {
  const skeletonItems = Array.from({ length: count });

  const getSkeletonClass = () => {
    switch (type) {
      case 'card': return 'skeleton-card';
      case 'circle': return 'skeleton-circle';
      case 'avatar': return 'skeleton-avatar';
      case 'button': return 'skeleton-button';
      case 'text': return 'skeleton-text';
      default: return 'skeleton-text';
    }
  };

  return (
    <div className="skeleton-container">
      {skeletonItems.map((_, index) => (
        <div
          key={index}
          className={`skeleton ${getSkeletonClass()}`}
          style={{ width, height }}
        ></div>
      ))}
    </div>
  );
};

export default LoadingSpinner;