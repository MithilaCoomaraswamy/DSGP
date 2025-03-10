import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const AccountSettings = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  // Hamburger menu logic
  const hamburgerRef = useRef(null);
  const menuRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/change-password', {
        currentPassword,
        newPassword,
      });

      if (response.data.success) {
        alert('Password changed successfully');
      } else {
        setError('Error changing password. Please try again.');
      }
    } catch (error) {
      setError('An error occurred while changing the password.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      setLoading(true);

      try {
        const response = await axios.delete('http://localhost:5000/delete-account', {
          data: {
            email: 'user@example.com', // Assuming the email is available in the session or from localStorage
          },
        });

        if (response.data.success) {
          alert('Account deleted successfully.');
          navigate('/');
        } else {
          setError('Error deleting account. Please try again.');
        }
      } catch (error) {
        setError('An error occurred while deleting the account.');
      } finally {
        setLoading(false);
      }
    }
  };

  // Footer style
  const footerStyle = {
    backgroundColor: '#f8f9fa',
    padding: '20px 0',
    textAlign: 'center',
  };

  return (
    <div>
      {/* Header Section */}
      <div className="header">
        <div className="logo">
          <Link to="/Profile" className="logo-link">
            <img src="logo.png" alt="Logo" className="logo-img" />
          </Link>
        </div>

        <div className="header-nav">
          <div ref={hamburgerRef} className="hamburger-icon" onClick={toggleMenu}>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>

          <ul ref={menuRef} className={`header-nav-list ${menuOpen ? 'open' : ''}`}>
            <Link to="/profile" className="logo-link">
              <li className="header-btn">Home</li>
            </Link>
            <Link to="/account" className="logo-link">
              <li className="header-btn">Edit Profile</li>
            </Link>
            <Link to="/" className="logo-link">
              <li className="header-btn btn-warning">Logout</li>
            </Link>
          </ul>
        </div>
      </div>

      <div className="account-settings-container">
        <h2>Account Settings</h2>

        {/* Change Password Form */}
        <div className="change-password-form">
          <h3>Change Password</h3>
          <form onSubmit={handlePasswordChange}>
            <label>Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />

            <label>New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />

            <label>Confirm New Password</label>
            <input
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              required
            />

            {error && <div className="error-message" style={{ color: 'red' }}>{error}</div>}

            <button type="submit" disabled={loading}>
              {loading ? 'Changing Password...' : 'Change Password'}
            </button>
          </form>
        </div>

        {/* Delete Account Button */}
        <div className="delete-account">
          <h3>Delete Account</h3>
          <button onClick={handleDeleteAccount} style={{ backgroundColor: 'red', color: 'white' }} disabled={loading}>
            {loading ? 'Deleting Account...' : 'Delete Account'}
          </button>
        </div>
      </div>

      <footer style={footerStyle} className="footer">
        <div className="footer-container">
          <div>
            <h3>About Us</h3>
            <p><a href="/about" target="_blank" className="footer-link">Learn more about our company and mission.</a></p>
          </div>
          <div>
            <h3>Contact Us</h3>
            <p>Email us at: <a href="mailto:fempredict@gmail.com" className="footer-link">fempredict@gmail.com</a></p>
          </div>
          <div>
            <h3>Privacy Policy</h3>
            <p><a href="/privacypolicy" target="_blank" className="footer-link">Read our privacy policy</a></p>
          </div>
          <div>
            <h3>Terms of Use</h3>
            <p><a href="/termsofservice" target="_blank" className="footer-link">View terms of use</a></p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 FemPredict. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default AccountSettings;
