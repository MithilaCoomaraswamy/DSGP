import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [cycleLength, setCycleLength] = useState('');
  const [mensesLength, setMensesLength] = useState('');
  const [lastCycleLength, setLastCycleLength] = useState('');
  const [meanMensesLength, setMeanMensesLength] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [periods, setPeriods] = useState([]);
  const [ovulationDate, setOvulationDate] = useState(null);
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

  // Function to determine the phase of the cycle based on the selected date
  const getCyclePhase = (date) => {
    if (!startDate || !cycleLength) return '';

    const start = new Date(startDate);
    const cycle = parseInt(cycleLength);
    const diffInTime = date - start;
    const diffInDays = Math.floor(diffInTime / (1000 * 3600 * 24));

    if (diffInDays < 0) return '';

    const cycleDay = diffInDays % cycle;

    if (cycleDay >= 0 && cycleDay < mensesLength) {
      return 'menstrual';
    } else if (cycleDay >= mensesLength && cycleDay <= 13) {
      return 'follicular';
    } else if (cycleDay === 14) {
      setOvulationDate(date); // Set ovulation date when phase is ovulation
      return 'ovulation';
    } else {
      return 'luteal';
    }
  };

  // Store the start dates of each period
  const trackPeriodStart = () => {
    if (startDate && cycleLength) {
      const start = new Date(startDate);
      const periodsList = [];

      // Generate start dates for each period over a year (12 cycles)
      for (let i = 0; i < 12; i++) {
        const newStartDate = new Date(start);
        newStartDate.setMonth(start.getMonth() + i);
        periodsList.push(newStartDate);
      }

      setPeriods(periodsList);
    }
  };

  // Style function to determine the background color of each day
  const tileClassName = ({ date }) => {
    const phase = getCyclePhase(date);
    if (phase === 'menstrual') {
      return 'menstrual-phase';
    } else if (phase === 'follicular') {
      return 'follicular-phase';
    } else if (phase === 'ovulation') {
      return 'ovulation-phase'; // Highlight ovulation day
    } else if (phase === 'luteal') {
      return 'luteal-phase';
    }
    return '';
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
                  <p>Track your periods and view ovulation dates here.</p>
                  <img src="pic1.PNG" alt="Period Tracker" className="tracker-image" />
                  <button className="rounded-btn">Start Tracking</button> {/* Added rounded button */}
                </div>

                {/* Health Insights Section */}
                <div className="health-insights-container">
                  <h2>Check Your Symptoms</h2>
                  <p>Check your symptoms and find out how to manage them here.</p>
                  <img src="pic2.PNG" alt="Health Insights" className="insights-image" />
                  <button className="rounded-btn">Learn More</button> {/* Added rounded button */}
                </div>

                {/* Recent Activity Section */}
                <div className="recent-activity-container">
                  <h2>Plan Your Workout</h2>
                  <p>Discover the best workout plan for you here.</p>
                  <img src="pic3.PNG" alt="Recent Activity" className="activity-image" />
                  <button className="rounded-btn">View Activity</button> {/* Added rounded button */}
                </div>
              </div>

              {ovulationDate && (
                <div className="calendar-container">
                  <h2>Track Your Period</h2>
                  <p>Select a date to see your cycle phase.</p>
                  <Calendar
                    onChange={handleDateChange}
                    tileClassName={tileClassName}
                    value={selectedDate}
                    minDate={new Date(startDate)}
                  />
                </div>
              )}
            </div>
          </>
        ) : (
          <p>Loading user data...</p>
        )}
      </div>

      <div className="chatbot-avatar" onClick={() => alert('Chatbot window opens')}>
        <img src="botAvatar.PNG" alt="Chatbot Avatar" className="avatar-img" />
      </div>
    </div>
  );
};

// PeriodTracker Component (No inputs, just a display)
const PeriodTracker = () => {
  return (
    <div>
      <p>View your cycle phases and ovulation dates here.</p>
      <img src="pic1.PNG" alt="Cycle Phases" className="tracker-image" />
    </div>
  );
};

export default Profile;
