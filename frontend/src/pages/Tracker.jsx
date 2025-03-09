import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom'; 
import Footer from './Footer';

const Tracker = () => {
  const [user, setUser] = useState(null);
  const [lastMensesDate, setLastMensesDate] = useState('');
  const [MeanMensesLength, setMeanMensesLength] = useState('');
  const [MeanCycleLength, setMeanCycleLength] = useState('');
  const [LengthofCycle, setLengthofCycle] = useState('');
  const [LengthofMenses, setLengthofMenses] = useState('');
  const [error, setError] = useState('');
  const [ovulationDate, setOvulationDate] = useState('');
  const [nextPeriodDate, setNextPeriodDate] = useState('');
  const [fertileWindow, setFertileWindow] = useState([]);
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const hamburgerRef = useRef(null);

  const footerStyle = {
    backgroundColor: 'white',
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setOvulationDate('');
    setNextPeriodDate('');
    setFertileWindow([]);
    setLoading(true);

    if (!lastMensesDate || !MeanMensesLength || !MeanCycleLength || !LengthofCycle || !LengthofMenses) {
      setError('Please fill all fields');
      setLoading(false);
      return;
    }

    const parsedMeanMensesLength = parseInt(MeanMensesLength);
    const parsedMeanCycleLength = parseInt(MeanCycleLength);
    const parsedLengthofCycle = parseInt(LengthofCycle);
    const parsedLengthofMenses = parseInt(LengthofMenses);

    if (isNaN(parsedMeanMensesLength) || isNaN(parsedMeanCycleLength) || isNaN(parsedLengthofCycle) || isNaN(parsedLengthofMenses)) {
      setError('Please provide valid numeric values for all fields.');
      setLoading(false);
      return;
    }

    try {
      const ovulationResponse = await axios.post('http://localhost:5000/predict_ovulation', {
        user: user,
        email: user?.email, // Send the user's email along with the other data
        startDate: lastMensesDate,
        LengthofCycle: parsedLengthofCycle,
        MeanCycleLength: parsedMeanCycleLength,
        LengthofMenses: parsedLengthofMenses,
        MeanMensesLength: parsedMeanMensesLength,
      });

      const { predictedOvulationDate } = ovulationResponse.data;
      const ovulationDateObject = new Date(predictedOvulationDate);
      setOvulationDate(ovulationDateObject.toLocaleDateString());

      // Calculate fertile window (5 days before ovulation)
      let fertileWindowDates = [];
      for (let i = 1; i <= 5; i++) {
        let fertileDay = new Date(ovulationDateObject);
        fertileDay.setDate(ovulationDateObject.getDate() - i);
        fertileWindowDates.push(fertileDay.toLocaleDateString());
      }
      setFertileWindow(fertileWindowDates);

      // Now make a request to predict next period date
      const cycleLengthResponse = await axios.post('http://localhost:5000/predict_cycle_length', {
        user: user,
        email: user?.email,
        startDate: lastMensesDate,
        MeanCycleLength: parsedMeanCycleLength,
        LengthofMenses: parsedLengthofMenses,
        MeanMensesLength: parsedMeanMensesLength,
      });

      const { next_period_date } = cycleLengthResponse.data;
      setNextPeriodDate(new Date(next_period_date).toLocaleDateString());

      const periodData = {
        email: user.user.email,
        startDate: lastMensesDate,
        LengthofCycle: parsedLengthofCycle,
        MeanCycleLength: parsedMeanCycleLength,
        LengthofMenses: parsedLengthofMenses,
        MeanMensesLength: parsedMeanMensesLength,
      };
      
      console.log('Sending data to backend:', periodData);
      
      await axios.post('http://localhost:5000/save_period_data', periodData);

      console.log("Data submitted successfully:");
    } catch (error) {
      setError('An error occurred. Please try again later.');
      console.error("Error during form submission:", error.response ? error.response.data : error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header Section */}
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
            <Link to="" className="logo-link">
              <li className="header-btn">Edit Profile</li>
            </Link>
            <Link to="/" className="logo-link">
              <li className="header-btn btn-warning">Logout</li>
            </Link>
          </ul>
        </div>
      </div>

      {/* Tracker Page Content */}
      <div className="tracker-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px' }}>
  <div style={{ flex: 1 }}>
    <h2>Menstrual Cycle Tracker</h2>
    <form onSubmit={handleSubmit} className="tracker-form" style={{ display: 'flex', flexDirection: 'column' }}>
      <label>When did your last period start?</label>
      <input
        type="date"
        value={lastMensesDate}
        onChange={(e) => setLastMensesDate(e.target.value)}
        required
      />

      <label>How many days did your period last?</label>
      <input
        type="number"
        value={LengthofMenses}
        onChange={(e) => setLengthofMenses(e.target.value)}
        required
        min="1"
      />

      <label>How long was your menstrual cycle?</label>
      <input
        type="number"
        value={LengthofCycle}
        onChange={(e) => setLengthofCycle(e.target.value)}
        required
        min="1"
      />

      <label>What is your average period length?</label>
      <input
        type="number"
        value={MeanMensesLength}
        onChange={(e) => setMeanMensesLength(e.target.value)}
        required
        min="1"
      />

      <label>What is your average cycle length?</label>
      <input
        type="number"
        value={MeanCycleLength}
        onChange={(e) => setMeanCycleLength(e.target.value)}
        required
        min="1"
      />

      {error && <div className="error-message" style={{ color: 'red', marginTop: '10px' }}>{error}</div>}

      <button type="submit" disabled={loading} style={{ marginTop: '10px' }}>
        {loading ? 'Submitting...' : 'Log Period'}
      </button>
    </form>

    {ovulationDate && nextPeriodDate && (
      <div className="results" style={{ display: 'flex', gap: '20px', marginTop: '20px', marginBottom: '40px' }}>
        {/* Ovulation Date Box */}
        <div className="ovulation-date-box" style={{
          backgroundColor: '#f8f9fa',
          borderRadius: '10px',
          padding: '20px',
          border: '1px solid #ddd',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          width: '48%',
        }}>
          <h4 style={{ color: '#4CAF50', fontSize: '20px' }}>Predicted Ovulation Date:</h4>
          <p style={{ fontSize: '18px', color: '#333' }}>{ovulationDate}</p>
        </div>

        {/* Next Period Date Box */}
        <div className="next-period-date-box" style={{
          backgroundColor: '#f8f9fa',
          borderRadius: '10px',
          padding: '20px',
          border: '1px solid #ddd',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          width: '48%',
        }}>
          <h4 style={{ color: 'red', fontSize: '20px' }}>Predicted Next Period Date:</h4>
          <p style={{ fontSize: '18px', color: '#333' }}>{nextPeriodDate}</p>
        </div>

        {/* Fertile Window Box */}
        {fertileWindow.length > 0 && (
          <div className="fertile-window-box" style={{
            backgroundColor: '#fff3e0',
            borderRadius: '10px',
            padding: '20px',
            border: '1px solid #ddd',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            width: '48%',  // Place this box next to the next period box
          }}>
            <h4 style={{ color: '#FF8C00', fontSize: '20px' }}>Fertile Window:</h4>
            <p style={{ fontSize: '18px', color: '#333' }}>
              From {fertileWindow[4]} to {fertileWindow[0]}
            </p>
          </div>
        )}
      </div>
    )}
  </div>

  <div style={{ width: '500px' }}>
    <img
      src="pic1 (9).png"
      alt="Cycle Tracker"
      style={{ width: '100%', height: 'auto' }}
      loading="lazy"
    />
  </div>
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

export default Tracker;
