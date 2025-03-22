import React, { useState, useEffect } from 'react';
import Modal from './Modal'; // Import your Modal component for login/signup

const Profile = () => {
  const [userData, setUserData] = useState({ email: '' });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to manage login status

  useEffect(() => {
    // Check if the user is logged in and fetch profile if they are
    const fetchProfile = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Include token if using authentication (e.g., JWT)
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(data);
          setEmail(data.email);
          setIsLoggedIn(true); // User is logged in
        } else {
          setMessage('Please log in to view your profile.');
          setIsLoggedIn(false); // User is not logged in
          setIsModalOpen(true); // Open modal to login/signup
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setMessage('Error fetching profile');
      }
    };

    fetchProfile();
  }, []);

  // Handle profile update
  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      const response = await fetch('http://localhost:5000/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
      } else {
        setMessage(data.message);
      }
      setIsUpdating(false);
    } catch (error) {
      setMessage('Error updating profile');
      setIsUpdating(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Remove auth token from local storage
    setIsLoggedIn(false); // Set logged-in status to false
    setMessage('Logged out successfully');
    setIsModalOpen(true); // Open modal to prompt login/signup
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/delete-account', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('Account deleted successfully');
        handleLogout(); // Log out the user after account deletion
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage('Error deleting account');
    }
  };

  return (
    <div className="profile-container">
      <h1>User Profile</h1>
      <p>{message}</p>

      {/* If logged in, show profile form, otherwise show modal */}
      {isLoggedIn ? (
        <>
          <form onSubmit={handleUpdate}>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">New Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" disabled={isUpdating}>
              {isUpdating ? 'Updating...' : 'Update Profile'}
            </button>
          </form>

          {/* Buttons for logout and delete account */}
          <button onClick={handleLogout}>Log Out</button>
          <button onClick={handleDeleteAccount}>Delete Account</button>
        </>
      ) : (
        <p>Please log in to manage your profile.</p>
      )}

      {/* Modal for login/signup */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Sign Up" />
    </div>
  );
};

export default Profile;
