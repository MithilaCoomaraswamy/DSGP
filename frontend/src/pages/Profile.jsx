import { useState, useEffect, useRef } from 'react';
import { TbBackground } from 'react-icons/tb';
import { useNavigate, Link } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const hamburgerRef = useRef(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user'); // Retrieve the user data from localStorage
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);  // Safely parse the data
        setUser(parsedUser);  // Set the parsed user data into state
      } catch (error) {
        console.error('Error parsing user data:', error);  // Handle parsing error
      }
    }
  }, []); 

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

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
    setMenuOpen(!menuOpen);
  };

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
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [menuOpen]);

  const handleChatbotClick = () => {
    const popupWindow = window.open('/chatbot', 'ChatbotPopup', 'width=600,height=800,resizable=yes,scrollbars=yes');
    if (popupWindow) {
      popupWindow.focus();
    }
  };

  const footerStyle = {
    backgroundColor: 'white',
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
            <Link to="/profile" className="logo-link">
              <li className="header-btn">Home</li>
            </Link>
            <Link to="/period-tracker" className="logo-link">
              <li className="header-btn">Period Tracker</li>
            </Link>
            <Link to="/pcos-quiz" className="logo-link">
              <li className="header-btn">PCOS Quiz</li>
            </Link>            <Link to="/exercise-recommender" className="logo-link">
              <li className="header-btn">Exercise Recommender</li>
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

      <div className="chatbot-avatar" onClick={handleChatbotClick}>
        <img src="botAvatar.PNG" alt="Chatbot Avatar" className="avatar-img" />
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

export default Profile;
