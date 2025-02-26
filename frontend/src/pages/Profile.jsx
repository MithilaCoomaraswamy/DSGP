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
          <img src="logo.png" alt="Logo" className="logo-img" />
        </div>

        {user && (
          <div className="user-info">
            <h3>Welcome, {user.name}</h3>
          </div>
        )}

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
                <div className="period-tracker-container">
                  <h2>Track Your Cycle</h2>
                  <PeriodTracker 
                    setStartDate={setStartDate} 
                    setCycleLength={setCycleLength} 
                    setMensesLength={setMensesLength}
                    setLastCycleLength={setLastCycleLength}
                    setMeanMensesLength={setMeanMensesLength}
                    trackPeriodStart={trackPeriodStart} 
                  />
                </div>

                <div className="health-insights-container">
                  <h2>Health Insights</h2>
                  <p>Discover insights about your cycle and health trends.</p>
                  {/* Add any relevant information or insights here */}
                </div>

                <div className="recent-activity-container">
                  <h2>Recent Activity</h2>
                  <p>View your recent health activity, like workouts or notes.</p>
                  {/* Display any relevant recent activity data here */}
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

// PeriodTracker Component (same as before)
const PeriodTracker = ({ setStartDate, setCycleLength, setMensesLength, setLastCycleLength, setMeanMensesLength, trackPeriodStart }) => {
  const [startDate, setStartDateLocal] = useState('');
  const [cycleLength, setCycleLengthLocal] = useState('');
  const [mensesLength, setMensesLengthLocal] = useState('');
  const [lastCycleLength, setLastCycleLengthLocal] = useState('');
  const [meanMensesLength, setMeanMensesLengthLocal] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setStartDate(startDate);
    setCycleLength(cycleLength);
    setMensesLength(mensesLength);
    setLastCycleLength(lastCycleLength);
    setMeanMensesLength(meanMensesLength);
    trackPeriodStart();
  };

  return (
    <div>
      <form className="period-tracker-form" onSubmit={handleSubmit}>
        <label htmlFor="start-date">When did your last period start?</label>
        <input
          type="date"
          id="start-date"
          name="start-date"
          value={startDate}
          onChange={(e) => setStartDateLocal(e.target.value)}
        />

        <label htmlFor="menses-length">How many days did your period last?</label>
        <input
          type="number"
          id="menses-length"
          name="menses-length"
          placeholder="5"
          value={mensesLength}
          onChange={(e) => setMensesLengthLocal(e.target.value)}
        />

        <label htmlFor="last-cycle-length">What was your last cycle length?</label>
        <input
          type="number"
          id="last-cycle-length"
          name="last-cycle-length"
          placeholder="28"
          value={lastCycleLength}
          onChange={(e) => setLastCycleLengthLocal(e.target.value)}
        />

        <label htmlFor="mean-menses-length">What is your average period length?</label>
        <input
          type="number"
          id="mean-menses-length"
          name="mean-menses-length"
          placeholder="5"
          value={meanMensesLength}
          onChange={(e) => setMeanMensesLengthLocal(e.target.value)}
        />

        <label htmlFor="cycle-length">What is your average menstrual cycle length?</label>
        <input
          type="number"
          id="cycle-length"
          name="cycle-length"
          placeholder="28"
          value={cycleLength}
          onChange={(e) => setCycleLengthLocal(e.target.value)}
        />

        <button type="submit">Start tracking</button>
      </form>
    </div>
  );
};

export default Profile;
