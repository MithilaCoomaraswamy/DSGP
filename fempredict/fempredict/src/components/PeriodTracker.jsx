import React, { useState, useEffect } from 'react';
import '../styles/PeriodTracker.css';

const PeriodTracker = () => {
  const [startDate, setStartDate] = useState(''); // Last period start date
  const [cycleLength, setCycleLength] = useState(''); // Current cycle length
  const [mensesLength, setMensesLength] = useState(''); // Duration of the last period
  const [averageCycleLength, setAverageCycleLength] = useState(null); // Automatically calculated average cycle length
  const [averageMensesLength, setAverageMensesLength] = useState(null); // Automatically calculated average menses length
  const [cycleHistory, setCycleHistory] = useState([]); // Stores all cycle entries
  const [nextMensesDate, setNextMensesDate] = useState(''); // Predicted next period date
  const [ovulationDate, setOvulationDate] = useState(''); // Predicted ovulation date
  const [fertileWindow, setFertileWindow] = useState(''); // Fertile window period
  const [errors, setErrors] = useState({}); // State for form validation errors
  const [lastPeriodStartDate, setLastPeriodStartDate] = useState(''); // Last period start date from history
  const [isAuthenticated, setIsAuthenticated] = useState(false); // To check if user is logged in

  // Check if the user is logged in by checking localStorage
  useEffect(() => {
    try {
      const user = localStorage.getItem('user');
      if (user) {
        setIsAuthenticated(true);
        // Fetch cycle history from the backend for logged-in users
        fetchCycleHistoryFromDB();
      } else {
        setIsAuthenticated(false);
        // Use default cycle history for non-logged-in users if needed
        const userCycleHistory = JSON.parse(localStorage.getItem('cycleHistory')) || [];
        setCycleHistory(userCycleHistory);
      }
    } catch (error) {
      console.error('Error reading from localStorage:', error);
    }
  }, []);

  const fetchCycleHistoryFromDB = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user?.email) {
        throw new Error('Email is required');
      }

      const response = await fetch('http://localhost:5000/get_cycle_data', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      if (response.ok) {
        setCycleHistory(result.cycleHistory || []);
      } else {
        console.error('Error fetching cycle history:', result.error);
      }
    } catch (error) {
      console.error('Error calling backend to fetch cycle history:', error);
    }
  };

  // Automatically calculate average cycle length and menses length from cycle history
  useEffect(() => {
    if (cycleHistory.length > 0) {
      const avgCycleLength = calculateAverage('cycleLength');
      const avgMensesLength = calculateAverage('mensesLength');
      setAverageCycleLength(avgCycleLength);
      setAverageMensesLength(avgMensesLength);

      // Update last period start date based on the latest cycle
      setLastPeriodStartDate(cycleHistory[cycleHistory.length - 1].startDate);

      // Calculate predictions for next period, ovulation date, and fertile window
      const lastCycle = cycleHistory[cycleHistory.length - 1];
      const lastPeriodStart = new Date(lastCycle.startDate);
      const nextPeriod = new Date(lastPeriodStart);
      nextPeriod.setDate(lastPeriodStart.getDate() + lastCycle.cycleLength);
      setNextMensesDate(nextPeriod.toLocaleDateString());

      const ovulation = new Date(nextPeriod);
      ovulation.setDate(nextPeriod.getDate() - 14);
      setOvulationDate(ovulation.toLocaleDateString());

      const fertileStart = new Date(ovulation);
      fertileStart.setDate(ovulation.getDate() - 5);
      const fertileEnd = new Date(ovulation);
      fertileEnd.setDate(ovulation.getDate() + 1);
      setFertileWindow(`${fertileStart.toDateString()} - ${fertileEnd.toDateString()}`);
    }
  }, [cycleHistory]);

  // Calculate average length of a specific field (cycleLength or mensesLength)
  const calculateAverage = (field) => {
    if (cycleHistory.length === 0) return 0;

    const total = cycleHistory.reduce((acc, cycle) => acc + cycle[field], 0);
    return total / cycleHistory.length;
  };

  // Form validation function
  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    const currentDate = new Date();
    const inputStartDate = new Date(startDate);
    
    // Validate start date: it should not be today or in the future
    if (!startDate || inputStartDate > currentDate) {
        formErrors.startDate = 'Start date must be a valid date in the past.';
        isValid = false;
    }

    // Validate cycle length and menses length
    if (!cycleLength || cycleLength < 21 || cycleLength > 35) {
        formErrors.cycleLength = 'Cycle length must be between 21 and 35 days. Please consult a doctor if it is outside this range.';
        isValid = false;
    }

    if (!mensesLength || mensesLength < 2 || mensesLength > 7) {
        formErrors.mensesLength = 'Menses length must be between 2 and 7 days. Please consult a doctor if it is outside this range.';
        isValid = false;
    }

    // Ensure that the period plus menses length is not in the future
    const periodEndDate = new Date(inputStartDate);
    periodEndDate.setDate(inputStartDate.getDate() + parseInt(mensesLength)); // End date of the current period

    if (periodEndDate > currentDate) {
        formErrors.mensesLength = 'The end date of your period should not be in the future.';
        isValid = false;
    }

    setErrors(formErrors);
    return isValid;
};

  // Submit the form to save data
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Prevent second cycle from being earlier than the first cycle
    if (cycleHistory.length > 0) {
      const lastCycleStartDate = new Date(cycleHistory[cycleHistory.length - 1].startDate);
      const newCycleStartDate = new Date(startDate);

      if (newCycleStartDate <= lastCycleStartDate) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          startDate: 'Start date must be later than the last recorded cycle.',
        }));
        return;
      }
    }

    // Calculate the cycle number (1 if no history, else the next number based on history length)
    const cycleNumber = cycleHistory.length === 0 ? 1 : cycleHistory.length + 1;

    const cycleData = {
      startDate,
      cycleLength: parseInt(cycleLength),
      mensesLength: parseInt(mensesLength),
      averageCycleLength,
      averageMensesLength: averageMensesLength || mensesLength,
      cycleNumber,
      email: JSON.parse(localStorage.getItem('user'))?.email, // Get the email from localStorage
    };

    try {
      if (isAuthenticated) {
        await saveCycleToDB(cycleData); // Save to backend for authenticated users
      } else {
        // Save to localStorage if not authenticated
        setCycleHistory((prevHistory) => {
          const updatedHistory = [...prevHistory, cycleData];
          localStorage.setItem('cycleHistory', JSON.stringify(updatedHistory));
          return updatedHistory;
        });
      }

      setStartDate('');
      setCycleLength('');
      setMensesLength('');
    } catch (error) {
      console.error('Error while saving cycle data:', error);
    }
  };

  // Save cycle data to the backend (for logged-in users)
  const saveCycleToDB = async (newCycle) => {
    try {
      const response = await fetch('http://localhost:5000/save_cycle_data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCycle),
      });

      const result = await response.json();
      if (response.ok) {
        console.log('Cycle saved successfully:', result);
      } else {
        console.error('Error saving cycle:', result.error);
      }
    } catch (error) {
      console.error('Error calling backend to save cycle:', error);
    }
  };

  const handleCycleLengthChange = (e) => setCycleLength(e.target.value);
  const handleMensesLengthChange = (e) => setMensesLength(e.target.value);

  return (
    <div className="period-tracker">
      <header>
        <h1>PCOS Period Tracker</h1>
        <p>Track your cycles, monitor your symptoms, and manage your health.</p>
      </header>

      <section className="tracker-dashboard">
        <h2>Current Cycle Overview</h2>
        <div className="cycle-info">
          <p><strong>Start Date:</strong> {lastPeriodStartDate ? new Date(lastPeriodStartDate).toLocaleDateString() : 'N/A'}</p>
          <p><strong>Next Period:</strong> {nextMensesDate || 'N/A'}</p>
          <p><strong>Ovulation Date:</strong> {ovulationDate || 'N/A'}</p>
          <p><strong>Fertile Window:</strong> {fertileWindow || 'N/A'}</p>
          <p><strong>Average Cycle Length:</strong> {averageCycleLength ? `${averageCycleLength} Days` : 'N/A'}</p>
          <p><strong>Average Menses Length:</strong> {averageMensesLength ? `${averageMensesLength} Days` : 'N/A'}</p>
        </div>
      </section>

      <section className="track-cycle-form">
        <h2>Track Your Cycle</h2>
        <form onSubmit={handleSubmit}>
          {/* Last Period Start Date */}
          <label htmlFor="start-date">When did your last period start?</label>
          <input
            type="date"
            id="start-date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
          {errors.startDate && <p className="error">{errors.startDate}</p>}

          {/* Cycle Length (Days) */}
          <label htmlFor="cycle-length">Cycle Length (Days):</label>
          <input
            type="number"
            id="cycle-length"
            value={cycleLength}
            onChange={handleCycleLengthChange}
            placeholder="Enter your cycle length"
            required
          />
          {errors.cycleLength && <p className="error">{errors.cycleLength}</p>}

          {/* Menses Length (Days) */}
          <label htmlFor="menses-length">How many days did your last period last?</label>
          <input
            type="number"
            id="menses-length"
            value={mensesLength}
            onChange={handleMensesLengthChange}
            placeholder="Enter your period length"
            required
          />
          {errors.mensesLength && <p className="error">{errors.mensesLength}</p>}

          <button type="submit">Get Predictions</button>
        </form>
      </section>

      <section className="cycle-history">
        <h2>Your Cycle History</h2>
        <table>
          <thead>
            <tr>
              <th>Cycle Number</th>
              <th>Start Date</th>
              <th>Cycle Length</th>
              <th>Menses Length</th>
            </tr>
          </thead>
          <tbody>
            {cycleHistory.map((cycle, index) => (
              <tr key={index}>
                <td>{cycle.cycleNumber}</td> 
                <td>{new Date(cycle.startDate).toLocaleDateString()}</td>
                <td>{cycle.cycleLength} Days</td>
                <td>{cycle.mensesLength} Days</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <footer>
        <p>Contact us: support@pcosmanagement.com</p>
        <p>Legal Disclaimer: This information is for educational purposes and not a substitute for medical advice.</p>
      </footer>
    </div>
  );
};

export default PeriodTracker;
