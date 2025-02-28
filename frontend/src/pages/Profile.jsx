import React, { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [chatbotVisible, setChatbotVisible] = useState(false);
  const [chatbotMinimized, setChatbotMinimized] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);  // State to control hamburger menu visibility
  const navigate = useNavigate();

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

  const toggleChatbot = () => {
    setChatbotVisible(prevState => !prevState);
    setChatbotMinimized(false);
  };

  const toggleMinimizeChatbot = () => {
    setChatbotMinimized(prevState => !prevState);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);  // Toggle the hamburger menu
  };

  return (
    <div className="profile-page">
      <div className="header">
        <div className="logo">
          <img src="icon.png" alt="Logo" className="logo-img" />
          <span className="logo-name">FemPredict</span>
        </div>

        <div className="header-nav">
          {/* Hamburger menu icon */}
          <div className="hamburger-icon" onClick={toggleMenu}>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>

          {/* Navbar links */}
          <ul className={`header-nav-list ${menuOpen ? 'open' : ''}`}>
            <li onClick={() => navigate('/terms')} className="header-btn">Terms and Conditions</li>
            <li onClick={handleEditProfile} className="header-btn">Edit Profile</li>
            <li onClick={handleDeleteProfile} className="header-btn btn-danger">Delete Profile</li>
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

      {/* Chatbot Avatar or Cross Button */}
      {!chatbotVisible ? (
        <div className="chatbot-avatar" onClick={toggleChatbot}>
          <img src="botAvatar.PNG" alt="Chatbot Avatar" className="avatar-img" />
        </div>
      ) : (
        <div className="chatbot-close" onClick={toggleChatbot}>
          <span className="close-icon">×</span>
        </div>
      )}

      {/* Chatbot Window */}
      {chatbotVisible && (
        <div className={`chatbot-window ${chatbotMinimized ? 'minimized' : ''}`}>
          <div className="chatbot-header">
            <div className="logo">
              <img src="icon.png" alt="Logo" className="logo-img" />
              <span className="logo-name">FemPredict</span>
            </div>
            <button onClick={toggleMinimizeChatbot} className="minimize-btn">↓</button>
            <button onClick={toggleChatbot} className="close-btn">×</button>
          </div>
          <div className={`chatbot-body ${chatbotMinimized ? 'minimized' : ''}`}>
            {!chatbotMinimized && <p>Welcome to the chatbot! How can I assist you today?</p>}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div>
            <h3>About Us</h3>
            <p>Learn more about our company and mission.</p>
          </div>
          <div>
            <h3>Contact Us</h3>
            <p>Email us at: <a href="mailto:info@example.com" className="footer-link">info@example.com</a></p>
          </div>
          <div>
            <h3>Privacy Policy</h3>
            <p><a href="/privacy-policy" className="footer-link">Read our privacy policy</a></p>
          </div>
          <div>
            <h3>Terms of Use</h3>
            <p><a href="/terms-of-use" className="footer-link">View terms of use</a></p>
          </div>
          <div>
            <h3>Security</h3>
            <p>Your security is our priority. Learn more about our security practices.</p>
          </div>
          <div>
            <h3>Cookie Policy</h3>
            <p><a href="/cookie-policy" className="footer-link">Read our cookie policy</a></p>
          </div>
          <div>
            <h3>Accessibility Statement</h3>
            <p><a href="/accessibility-statement" className="footer-link">Learn about our accessibility statement</a></p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 Your Company Name. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Profile;
