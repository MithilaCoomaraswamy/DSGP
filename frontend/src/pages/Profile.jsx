import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [chatbotVisible, setChatbotVisible] = useState(false); // State to control chatbot visibility
  const [chatbotMinimized, setChatbotMinimized] = useState(false); // State to control chatbot minimization
  const navigate = useNavigate();

  // Logout functionality
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  // Load user data from localStorage
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
      setUser(userData);
    }
  }, []);

  // Handle profile deletion
  const handleDeleteProfile = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  // Handle edit profile
  const handleEditProfile = () => {
    navigate('/edit-profile');
  };

  // Navigate to change password page
  const handleChangePassword = () => {
    navigate('/change-password');
  };

  // Handle date selection in the calendar
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // Navigate to Period Tracker page
  const handlePeriodTracker = () => {
    navigate('/period-tracker');
  };

  // Navigate to Health Insights page
  const handleChecker = () => {
    navigate('/pcos-quiz');
  };

  // Navigate to Recent Activity page
  const handleRecommender = () => {
    navigate('/exercise-recommender');
  };

  // Toggle the visibility of the chatbot
  const toggleChatbot = () => {
    setChatbotVisible(prevState => !prevState);
    setChatbotMinimized(false); // Ensure chatbot is not minimized when opened
  };

  // Toggle chatbot minimization
  const toggleMinimizeChatbot = () => {
    setChatbotMinimized(prevState => !prevState);
  };

  return (
    <div className="profile-page">
      <div className="header">
        <div className="logo">
          <img src="icon.png" alt="Logo" className="logo-img" />
          <span className="logo-name">FemPredict</span>
        </div>

        <div className="header-nav">
          <ul className="header-nav-list">
            <li onClick={() => navigate('/terms')} className="header-btn">Terms and Conditions</li>
            <li onClick={handleEditProfile} className="header-btn">Edit Profile</li>
            <li onClick={handleDeleteProfile} className="header-btn btn-danger">Delete Profile</li>
            <li onClick={handleLogout} className="header-btn btn-warning">Logout</li>
          </ul>
        </div>
      </div>

      <div className="profile-content">
        {user ? (
          <>
            <div className="calendar-period-section">
              <div className="tracker-sections">
                {/* Period Tracker Section */}
                <div className="period-tracker-container">
                  <h2>Track Your Cycle</h2>
                  <p>Easily track your periods and discover your ovulation dates here.</p>
                  <img src="pic1.PNG" alt="Period Tracker" className="tracker-image" />
                  <button className="rounded-btn" onClick={handlePeriodTracker}>Start tracking</button>
                </div>

                {/* Health Insights Section */}
                <div className="health-insights-container">
                  <h2>Check Your Symptoms</h2>
                  <p>Take a look at your symptoms and discover some helpful tips for managing them here!</p>
                  <img src="pic2.PNG" alt="Health Insights" className="insights-image" />
                  <button className="rounded-btn" onClick={handleChecker}>Check now</button>
                </div>

                {/* Recent Activity Section */}
                <div className="recent-activity-container">
                  <h2>Plan Your Workout</h2>
                  <p>Uncover the perfect workout plan tailored just for you right here! Let’s get moving!</p>
                  <img src="pic3.PNG" alt="Recent Activity" className="activity-image" />
                  <button className="rounded-btn" onClick={handleRecommender}>Get moving</button>
                </div>
              </div>
            </div>
          </>
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
    </div>
  );
};

export default Profile;
