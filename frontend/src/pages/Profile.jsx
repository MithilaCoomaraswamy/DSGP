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
  const [mensesLength, setMensesLength] = useState(''); // New state for menses length
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

    if (cycleDay >= 0 && cycleDay < mensesLength) {  // Adjusted condition for menses phase
      return 'menstrual';
    } else if (cycleDay >= mensesLength && cycleDay <= 13) {
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

      <div className="profile-content">
        {user ? (
          <>
            {/* Calendar and Period Tracker Section */}
            <div className="calendar-period-section">
              
              {/* Period Tracker Form */}
              <div className="period-tracker-container">
                <h2>Track Your Cycle</h2>
                <PeriodTracker 
                  setStartDate={setStartDate} 
                  setCycleLength={setCycleLength} 
                  setMensesLength={setMensesLength}  // Pass mensesLength state setter
                  trackPeriodStart={trackPeriodStart} 
                />
              </div>

              {/* Calendar Section */}
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
        <img src="botAvatar.PNG" alt="Chatbot Avatar" className="avatar-img" />
      </div>
    </div>
  );
};

// PeriodTracker Component
const PeriodTracker = ({ setStartDate, setCycleLength, setMensesLength, trackPeriodStart }) => {
  const [startDate, setStartDateLocal] = useState('');
  const [cycleLength, setCycleLengthLocal] = useState('');
  const [mensesLength, setMensesLengthLocal] = useState(''); // Local state for menses length

  const handleSubmit = (e) => {
    e.preventDefault();
    setStartDate(startDate);
    setCycleLength(cycleLength);
    setMensesLength(mensesLength);  // Pass mensesLength to the parent
    trackPeriodStart(); // Track the start dates after submitting the form
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
          placeholder="e.g. 5"
          value={mensesLength}
          onChange={(e) => setMensesLengthLocal(e.target.value)}
        />
                
        <label htmlFor="cycle-length">How long is your menstrual cycle?</label>
        <input
          type="number"
          id="cycle-length"
          name="cycle-length"
          placeholder="e.g. 28"
          value={cycleLength}
          onChange={(e) => setCycleLengthLocal(e.target.value)}
        />


        <button type="submit">Start tracking</button>
      </form>
    </div>
  );
};

export default Profile;
