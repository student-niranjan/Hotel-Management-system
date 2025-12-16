// components/auth/ForgotPassword.jsx
import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import '../../styles/components.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState(1); // 1: Enter email, 2: Enter OTP, 3: Reset password
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { forgotPassword } = useContext(AuthContext);
  const navigate = useNavigate();

  // Simulate OTP generation (replace with actual API call)
  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleSubmitEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      // Simulate API call to send OTP
      const generatedOTP = generateOTP();
      localStorage.setItem('resetOTP', generatedOTP);
      localStorage.setItem('resetEmail', email);

      const result = await forgotPassword(email);
      
      if (result.success) {
        setMessage(`OTP has been sent to ${email}. Please check your email.`);
        setStep(2);
      } else {
        setError(result.error || 'Failed to send OTP');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = (e) => {
    e.preventDefault();
    const storedOTP = localStorage.getItem('resetOTP');
    
    if (otp === storedOTP) {
      setMessage('OTP verified successfully!');
      setStep(3);
    } else {
      setError('Invalid OTP. Please try again.');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Simulate API call to reset password
      const email = localStorage.getItem('resetEmail');
      
      // Here you would call your API to reset the password
      // await api.post('/auth/reset-password', { email, newPassword });
      
      setTimeout(() => {
        setMessage('Password reset successfully! Redirecting to login...');
        
        // Clear reset data
        localStorage.removeItem('resetOTP');
        localStorage.removeItem('resetEmail');
        
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }, 1500);
    } catch (err) {
      setError('Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = () => {
    const generatedOTP = generateOTP();
    localStorage.setItem('resetOTP', generatedOTP);
    setMessage('New OTP has been sent to your email.');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Forgot Password</h2>
        
        {/* Progress Steps */}
        <div className="progress-steps">
          <div className={`step ${step >= 1 ? 'active' : ''}`}>
            <div className="step-number">1</div>
            <div className="step-label">Enter Email</div>
          </div>
          <div className={`step ${step >= 2 ? 'active' : ''}`}>
            <div className="step-number">2</div>
            <div className="step-label">Verify OTP</div>
          </div>
          <div className={`step ${step >= 3 ? 'active' : ''}`}>
            <div className="step-number">3</div>
            <div className="step-label">New Password</div>
          </div>
        </div>

        {message && <div className="alert success">{message}</div>}
        {error && <div className="alert error">{error}</div>}

        {/* Step 1: Enter Email */}
        {step === 1 && (
          <form onSubmit={handleSubmitEmail}>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your registered email"
              />
              <p className="form-help">
                We'll send a verification code to this email
              </p>
            </div>
            
            <button 
              type="submit" 
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
            
            <div className="auth-footer">
              Remember your password? <Link to="/login">Back to Login</Link>
            </div>
          </form>
        )}

        {/* Step 2: Verify OTP */}
        {step === 2 && (
          <form onSubmit={handleVerifyOTP}>
            <div className="form-group">
              <label>Enter Verification Code</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                placeholder="Enter 6-digit OTP"
                maxLength={6}
              />
              <p className="form-help">
                Check your email for the OTP
              </p>
            </div>
            
            <div className="otp-actions">
              <button 
                type="button" 
                className="btn-text"
                onClick={handleResendOTP}
              >
                Resend OTP
              </button>
              <button 
                type="button" 
                className="btn-text"
                onClick={() => setStep(1)}
              >
                Change Email
              </button>
            </div>
            
            <button 
              type="submit" 
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>
        )}

        {/* Step 3: Reset Password */}
        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="Enter new password"
              />
              <div className="password-strength">
                <div className={`strength-bar ${newPassword.length >= 6 ? 'strong' : 'weak'}`}></div>
                <span className="strength-text">
                  {newPassword.length >= 6 ? 'Strong password' : 'Weak password'}
                </span>
              </div>
            </div>
            
            <div className="form-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm new password"
              />
            </div>
            
            <button 
              type="submit" 
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;