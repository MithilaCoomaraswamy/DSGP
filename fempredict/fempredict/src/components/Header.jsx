import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Modal from './Modal';
import '../styles/Header.css';

const Header = ({ setIsLoggedIn }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggedInState, setIsLoggedInState] = useState(false); // Track login state locally

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
  }, [setIsLoggedIn]);

  // Handle logout
  const handleSignOut = () => {
    localStorage.removeItem('user'); // Clear user data from localStorage
    setIsLoggedInState(false); // Update local state
    setIsLoggedIn(false); // Update global state
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

  return (
    <header className="header">
      <nav>
        <ul>
          <li>
            <Link to="/" className="logo">FemPredict</Link>
          </li>
          <li>
            <Link to="/pcos-risk-calculator">PCOS Risk Calculator</Link>
          </li>
          <li>
            <Link to="/period-tracker">Period Tracker</Link>
          </li>
          <li>
            <Link to="/exercise-recommender">Exercise Recommender</Link>
          </li>
          <li>
            <Link to="/chatbot">Chatbot</Link>
          </li>

          {/* Conditionally render Sign Up, Profile, or Sign Out link */}
          {!isLoggedInState ? (
            <li>
              <Link to="#" onClick={openModal}>Login</Link> {/* Open modal */}
            </li>
          ) : (
            <>
              <li>
                <Link to="/profile">
                  <img src="/images/people.png" alt="User Profile" />
                </Link> {/* Profile link when logged in */}
              </li>
              <li>
                <Link to="#" onClick={handleSignOut}>Sign Out</Link> {/* Sign out link */}
              </li>
            </>
          )}
        </ul>
      </nav>

      {/* Render the modal if it's open */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        onLogin={handleLogin}
      />
    </header>
  );
};

export default Header;
