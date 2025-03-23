import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch user data when the component mounts
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setEmail(user.email);
    } else {
      // If there's no user, redirect to home page
      navigate('/');
    }
  }, [navigate]);

  // Function to clear localStorage and reset login state
  const clearUserData = () => {
    localStorage.clear(); // Clear all localStorage data
    setIsLoggedIn(false);  // Reset global login state
  };

  // Handle email change
  const handleEmailChange = async (e) => {
    e.preventDefault();

    if (!newEmail) {
      setError('New email cannot be empty');
      return;
    }

    try {
      // Send a request to the backend to change the email
      const response = await fetch('http://localhost:5000/change-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        setEmail(newEmail); // Update local state
        setMessage('Email updated successfully!');
      } else {
        setError(data.message || 'An error occurred');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      // Send a request to the backend to change the password
      const response = await fetch('http://localhost:5000/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Password updated successfully!');
      } else {
        setError(data.message || 'An error occurred');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        const response = await fetch('http://localhost:5000/delete-account', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (response.ok) {
          // Clear user data from localStorage and reset login state
          clearUserData();
          navigate('/'); // Redirect to the home page
        } else {
          setError(data.message || 'An error occurred');
        }
      } catch (error) {
        setError('An error occurred. Please try again.');
      }
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      // Send a request to the backend to log out
      const response = await fetch('http://localhost:5000/logout', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        // On successful logout from the backend
        clearUserData();  // Clear user data from localStorage and reset login state
        navigate('/'); // Redirect to home page
      } else {
        setError(data.message || 'An error occurred while logging out');
      }
    } catch (error) {
      setError('An error occurred while logging out. Please try again.');
    }
  };

  return (
    <div className="profile">
      <h2>Profile Page</h2>

      {/* Display current email */}
      <div>
        <h3>Email: {email}</h3>
        <form onSubmit={handleEmailChange}>
          <input
            type="email"
            placeholder="New Email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
          <button type="submit">Change Email</button>
        </form>
      </div>

      {/* Change password section */}
      <div>
        <h3>Change Password</h3>
        <form onSubmit={handlePasswordChange}>
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button type="submit">Change Password</button>
        </form>
      </div>

      {/* Messages */}
      {message && <p className="message success">{message}</p>}
      {error && <p className="message error">{error}</p>}

      {/* Delete account */}
      <div>
        <button onClick={handleDeleteAccount} className="delete-account-btn">
          Delete Account
        </button>
      </div>

      {/* Logout */}
      <div>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
