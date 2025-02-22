import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Profile = () => {
  const [user, setUser] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [cycleLength, setCycleLength] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [periods, setPeriods] = useState([]); // Store the start dates of each period
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

    if (cycleDay >= 0 && cycleDay <= 5) {
      return 'menstrual';
    } else if (cycleDay >= 6 && cycleDay <= 13) {
      return 'follicular';
    } else if (cycleDay === 14) {
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
        newStartDate.setMonth(start.getMonth() + i); // Set the start date for each cycle
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
      return 'ovulation-phase';
    } else if (phase === 'luteal') {
      return 'luteal-phase';
    }
    return '';
  };

  // Prepare data for the chart
  const chartData = {
    labels: periods.map(period => period.toLocaleString('default', { month: 'short', year: 'numeric' })),
    datasets: [
      {
        label: 'Start Dates of Periods',
        data: periods.map(period => period.getDate()), // Use the day of the month as data
        fill: false,
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="profile-page">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo">
          <img src="logo.png" alt="Logo" className="logo-img" />
        </div>

        {user && (
          <div className="user-info">
            <h3>Welcome, {user.name}</h3>
          </div>
        )}

        <ul className="sidebar-nav">
          <li onClick={() => navigate('/terms')} className="sidebar-btn">Terms and conditions</li>
          <li onClick={handleEditProfile} className="sidebar-btn">Edit Profile</li>
          <li onClick={handleDeleteProfile} className="sidebar-btn btn-danger">Delete Profile</li>
          <li onClick={handleLogout} className="sidebar-btn btn-warning">Logout</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="profile-content">
        {user ? (
          <>
            {/* Calendar Section */}
            <div className="calendar-period-section">
              <div className="calendar-container">
                <h2>Track Your Period</h2>
                <p>Select a date to see your cycle phase.</p>
                <Calendar
                  onChange={handleDateChange}
                  tileClassName={tileClassName}
                  value={selectedDate}
                  minDate={new Date(startDate)} // Optional: Ensure the calendar starts from the first cycle day
                />
              </div>

              {/* Period Tracker Form */}
              <div className="period-tracker-container">
                <h2>Track Your Cycle</h2>
                <PeriodTracker setStartDate={setStartDate} setCycleLength={setCycleLength} trackPeriodStart={trackPeriodStart} />
              </div>

              {/* Chart Section */}
              <div className="chart-container">
                <h2>Your Period Trends</h2>
                <Line data={chartData} />
              </div>
            </div>
          </>
        ) : (
          <p>Loading user data...</p>
        )}
      </div>

      {/* Chatbot Avatar */}
      <div className="chatbot-avatar" onClick={() => alert('Chatbot window opens')}>
        <img src="chatbot-avatar.png" alt="Chatbot Avatar" className="avatar-img" />
      </div>
    </div>
  );
};

// PeriodTracker Component
const PeriodTracker = ({ setStartDate, setCycleLength, trackPeriodStart }) => {
  const [startDate, setStartDateLocal] = useState('');
  const [cycleLength, setCycleLengthLocal] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setStartDate(startDate);
    setCycleLength(cycleLength);
    trackPeriodStart(); // Track the start dates after submitting the form
  };

  return (
    <div>
      <form className="period-tracker-form" onSubmit={handleSubmit}>
        <label htmlFor="start-date">Start Date:</label>
        <input
          type="date"
          id="start-date"
          name="start-date"
          value={startDate}
          onChange={(e) => setStartDateLocal(e.target.value)}
        />

        <label htmlFor="cycle-length">Cycle Length (days):</label>
        <input
          type="number"
          id="cycle-length"
          name="cycle-length"
          placeholder="e.g. 28"
          value={cycleLength}
          onChange={(e) => setCycleLengthLocal(e.target.value)}
        />

        <button type="submit">Track Period</button>
      </form>
    </div>
  );
};

export default Profile;
