import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import '../styles/Header.css';
import Modal from './Modal'; // Import Modal component

const Header = () => {
  const navigate = useNavigate(); // Initialize navigate
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggedInState, setIsLoggedInState] = useState(false); // Track login state locally
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login status globally
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Track if menu is open

  const menuRef = useRef(null); // Ref for the dropdown menu
  const profileRef = useRef(null); // Ref for the profile picture
  
  // Check login status and listen for changes in localStorage
  useEffect(() => {
    const checkLoginStatus = () => {
      const user = localStorage.getItem('user');
      const loggedIn = Boolean(user); // If user exists in localStorage, they are logged in
      setIsLoggedInState(loggedIn); // Update local state
      setIsLoggedIn(loggedIn); // Update global state
    };

    checkLoginStatus(); // Initial check

    const storageListener = () => checkLoginStatus(); // Listen for changes in localStorage
    window.addEventListener('storage', storageListener);

    // Clean up listener on component unmount
    return () => window.removeEventListener('storage', storageListener);
  }, []);

  // Handle logout
  const handleSignOut = async () => {
    try {
      // Call the backend function to log out the user
      await fetch('http://localhost:5000/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: 'yourUserIdHere' }) // You may need to include the user ID or other data
      });
  
      // Clear user data from localStorage
      localStorage.removeItem('user');
      setIsLoggedInState(false); // Update local state
      setIsLoggedIn(false); // Update global state
  
      // Navigate to a different page after successful logout
      navigate('/'); // Redirect to home or a specific page
  
    } catch (error) {
      console.error('Error during logout:', error);
      // Optionally, handle error (show a message to the user, etc.)
    }
  };
  

  // Handle successful login
  const handleLogin = () => {
    setIsLoggedInState(true); // Update local state
    setIsLoggedIn(true); // Update global state
    setIsModalOpen(false); // Close modal after login
  };

  // Open the modal
  const openModal = () => setIsModalOpen(true);

  // Close the modal
  const closeModal = () => setIsModalOpen(false);

  // Toggle menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Navigate to different pages
  const navigateTo = (path) => {
    navigate(path); // Use navigate() for React Router v6
    setIsMenuOpen(false); // Close the menu after navigation
  };

  // Close the menu when clicking outside
  const handleClickOutside = (event) => {
    if (
      menuRef.current && !menuRef.current.contains(event.target) &&
      profileRef.current && !profileRef.current.contains(event.target)
    ) {
      setIsMenuOpen(false); // Close the menu if clicked outside
    }
  };

  // Add event listener to detect outside clicks
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside); // Detect clicks outside
    return () => {
      document.removeEventListener('mousedown', handleClickOutside); // Clean up listener
    };
  }, []);

  return (
    <header className="header">
      <nav className="nav">
        <div className="logo-container">
          <h1 className="logo">FemPredict</h1>
        </div>
        <div className="auth-container">
          {isLoggedInState ? (
            <div className="profile-picture" onClick={toggleMenu} ref={profileRef}>
              {/* Profile picture (use a placeholder or dynamic image URL) */}
              <img
                src="images/menu.png" // Replace with the user's actual profile image URL
                alt="Profile"
                className="profile-img"
              />
            </div>
          ) : (
            <button className="auth-btn" onClick={openModal}>
              Sign Up
            </button>
          )}
        </div>
      </nav>

      {/* Menu Dropdown (optional) */}
      {isMenuOpen && isLoggedInState && (
        <div className="menu-dropdown" ref={menuRef}>
          <button className="menu-item" onClick={() => navigateTo('/period-tracker')}>
            Period Tracker
          </button>
          <button className="menu-item" onClick={() => navigateTo('/pcos-risk-calculator')}>
            PCOS Risk Calculator
          </button>
          <button className="menu-item" onClick={() => navigateTo('/exercise-recommender')}>
            Exercise Recommender
          </button>
          <button className="menu-item" onClick={() => navigateTo('/chatbot')}>
            Chatbot
          </button>
          <button className="menu-item" onClick={handleSignOut}>
            Log Out
          </button>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        onLogin={handleLogin}
      />
    </header>
  );
};

export default Header;
