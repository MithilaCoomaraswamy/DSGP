import axios from 'axios';
import React, { useState, useEffect } from 'react'; 

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
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setOvulationDate('');
    setNextPeriodDate('');
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
      // First make a request to predict ovulation date
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
      setOvulationDate(new Date(predictedOvulationDate).toLocaleDateString());

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

    } catch (error) {
      setError('An error occurred. Please try again later.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tracker-container" style={{ display: 'flex', alignItems: 'flex-start' }}>
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
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </form>

        {ovulationDate && (
          <div className="results" style={{ textAlign: 'center', marginTop: '20px' }}>
            <div className="ovulation-date-box" style={{
              backgroundColor: '#f8f9fa',
              borderRadius: '10px',
              padding: '20px',
              border: '1px solid #ddd',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              width: '300px',
              margin: '0 auto'
            }}>
              <h4 style={{ color: '#4CAF50', fontSize: '20px' }}>Predicted Ovulation Date:</h4>
              <p style={{ fontSize: '18px', color: '#333' }}>{ovulationDate}</p>
            </div>
          </div>
        )}

        {nextPeriodDate && (
          <div className="results" style={{ textAlign: 'center', marginTop: '20px' }}>
            <div className="next-period-date-box" style={{
              backgroundColor: '#f8f9fa',
              borderRadius: '10px',
              padding: '20px',
              border: '1px solid #ddd',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              width: '300px',
              margin: '0 auto'
            }}>
              <h4 style={{ color: 'red', fontSize: '20px' }}>Predicted Next Period Date:</h4>
              <p style={{ fontSize: '18px', color: '#333' }}>{nextPeriodDate}</p>
            </div>
          </div>
        )}
      </div>

      <div style={{ marginLeft: '20px' }}>
        <img
          src="periods.png"
          alt="Cycle Tracker"
          style={{ width: '600px', height: 'auto' }}
          loading="lazy"
        />
      </div>
    </div>
  );
};

export default Tracker;
