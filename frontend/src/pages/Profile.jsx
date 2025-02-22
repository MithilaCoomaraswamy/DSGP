import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  useEffect(() => {
    // Retrieve user data from localStorage (or you could use a global state)
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
      setUser(userData);
    }
  }, []);

  return (
    <div className="profile-page">
      {/* Sidebar */}
      <div className="sidebar">
        {/* Logo at the top */}
        <div className="logo">
         <img src="logo.png" alt="Logo" className="logo-img" />
        </div>

        {/* User Handler and Welcome Message */}
        {user && (
          <div className="user-info">
            <div className="user-icon">
              <img src="user-icon.png" alt="User Icon" className="user-icon-img" />
            </div>
            <h3>Welcome, {user.name}</h3>
          </div>
        )}

        {/* Sidebar Navigation */}
        <ul>
          <li>Overview</li>
          <li>Settings</li>
          <li onClick={handleLogout}>Logout</li>
        </ul>
      </div>

      {/* Profile Content */}
      <div className="profile-content">
        {user ? (
          <>
           
          </>
        ) : (
          <p>Loading user data...</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
