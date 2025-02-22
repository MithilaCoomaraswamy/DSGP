import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import './App.css';

function ProfilePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const history = useHistory();

  const handleSignOut = () => {
    setIsLoggedIn(false);
    // Redirect to login page after sign out
    history.push("/");
  };

  return (
    <div className="profile-container">
      <div className="sidebar">
        <div className="profile-header">
          <div className="profile-picture">
            <img src="https://via.placeholder.com/100" alt="User Profile" />
          </div>
          <div className="profile-info">
            <h2>John Doe</h2>
            <p>john.doe@example.com</p>
          </div>
        </div>

        <div className="links">
          <ul>
            <li><a href="#overview">Overview</a></li>
            <li><a href="#settings">Settings</a></li>
            <li><a href="#notifications">Notifications</a></li>
          </ul>
        </div>
        <button onClick={handleSignOut} className="sign-out-button">
          Sign Out
        </button>
      </div>

      <div className="main-content">
        <h1>Welcome to Your Profile</h1>
        {isLoggedIn ? (
          <p>You're logged in, enjoy managing your profile!</p>
        ) : (
          <p>You have been signed out.</p>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
