import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false); // State to control hamburger menu visibility
  const navigate = useNavigate();

  // Ref to track the menu and hamburger icon
  const menuRef = useRef(null);
  const hamburgerRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
      setUser(userData);
    }
  }, []);

  const handleDeleteProfile = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleEditProfile = () => {
    navigate('/edit-profile');
  };

  const handleChangePassword = () => {
    navigate('/change-password');
  };

  const handlePeriodTracker = () => {
    navigate('/period-tracker');
  };

  const handleChecker = () => {
    navigate('/pcos-quiz');
  };

  const handleRecommender = () => {
    navigate('/exercise-recommender');
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen); // Toggle the hamburger menu
  };

  // Close menu if the user clicks outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        hamburgerRef.current &&
        !hamburgerRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [menuOpen]);

  // Open chatbot in a popup window
  const handleChatbotClick = () => {
    const popupWindow = window.open('/chatbot', 'ChatbotPopup', 'width=600,height=800,resizable=yes,scrollbars=yes');
    
    if (popupWindow) {
      popupWindow.focus(); // Ensures the popup window gets focus when opened
    }
  };

  return (
    <div className="profile-page">
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
            <li onClick={handleEditProfile} className="header-btn">Edit Profile</li>
            <li onClick={handleLogout} className="header-btn btn-warning">Logout</li>
          </ul>
        </div>
      </div>

      <div className="profile-content">
        {user ? (
          <div className="calendar-period-section">
            <div className="tracker-sections">
              <div className="period-tracker-container">
                <h2>Track Your Cycle</h2>
                <p>Easily track your periods and discover your ovulation dates here.</p>
                <img src="pic1.PNG" alt="Period Tracker" className="tracker-image" />
                <button className="rounded-btn" onClick={handlePeriodTracker}>Start tracking</button>
              </div>

              <div className="health-insights-container">
                <h2>Check Your Symptoms</h2>
                <p>Take a look at your symptoms and discover some helpful tips for managing them here!</p>
                <img src="pic2.PNG" alt="Health Insights" className="insights-image" />
                <button className="rounded-btn" onClick={handleChecker}>Check now</button>
              </div>

              <div className="recent-activity-container">
                <h2>Plan Your Workout</h2>
                <p>Uncover the perfect workout plan tailored just for you right here! Let’s get moving!</p>
                <img src="pic3.PNG" alt="Recent Activity" className="activity-image" />
                <button className="rounded-btn" onClick={handleRecommender}>Get moving</button>
              </div>
            </div>
          </div>
        ) : (
          <p>Loading user data...</p>
        )}
      </div>

      {/* Chatbot Avatar - clicking here will open the chatbot page in a popup window */}
      <div className="chatbot-avatar" onClick={handleChatbotClick}>
        <img src="botAvatar.PNG" alt="Chatbot Avatar" className="avatar-img" />
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div>
            <h3>About Us</h3>
            <p>Learn more about our company and mission.</p>
          </div>
          <div>
            <h3>Contact Us</h3>
            <p>Email us at: <a href="mailto:fempredict@gmail.com" className="footer-link">fempredict@gmail.com</a></p>
          </div>
          <div>
            <h3>Privacy Policy</h3>
            <p><a href="/privacy-policy" className="footer-link">Read our privacy policy</a></p>
          </div>
          <div>
            <h3>Terms of Use</h3>
            <p><a href="/terms-of-use" className="footer-link">View terms of use</a></p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 FemPredict. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Profile;
