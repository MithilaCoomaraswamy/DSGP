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
  const [currentOffset, setCurrentOffset] = useState(0);

  const email = localStorage.getItem('email'); // Get email from localStorage

  useEffect(() => {
    // Fetch cycle history only once when the component mounts
    if (email) {
      fetchCycleHistoryFromDB(email);
    }
  }, [email]); // Only run once when the component mounts and email is available
  
  useEffect(() => {
    // If we have cycle history, calculate the predictions
    if (cycleHistory.length > 0) {
      const latestCycle = cycleHistory[cycleHistory.length - 1];
      setLastPeriodStartDate(latestCycle.startDate); // Save the last cycle start date
  
      if (averageCycleLength) {
        calculatePredictionsFromHistory();
      }
    }
  }, [cycleHistory, averageCycleLength]); // Run only when cycleHistory or averageCycleLength changes
  
  
  const calculatePredictionsFromHistory = () => {
    if (!lastPeriodStartDate || !averageCycleLength) return;
  
    // Calculate next period date (next cycle's start date)
    const startDate = new Date(lastPeriodStartDate);
    startDate.setDate(startDate.getDate() + averageCycleLength);
    const nextMenses = startDate.toDateString();
  
    // Estimate ovulation date (about 14 days before the next period)
    const ovulationStart = new Date(startDate);
    ovulationStart.setDate(ovulationStart.getDate() - 14);
    const ovulationDate = ovulationStart.toDateString();
  
    // Calculate fertile window (5 days before and 1 day after ovulation)
    const startFertileWindow = new Date(ovulationStart);
    const endFertileWindow = new Date(ovulationStart);
    startFertileWindow.setDate(ovulationStart.getDate() - 5); // 5 days before ovulation
    endFertileWindow.setDate(ovulationStart.getDate() + 1); // 1 day after ovulation
  
    setNextMensesDate(nextMenses);
    setOvulationDate(ovulationDate);
    setFertileWindow(`${startFertileWindow.toDateString()} - ${endFertileWindow.toDateString()}`);
  };
  
  const fetchCycleHistoryFromDB = async (email) => {
    try {
      if (!email) {
        throw new Error('Email is required');
      }
  
      const response = await fetch(`http://localhost:5000/get_cycle_data?email=${email}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      const result = await response.json();
      console.log('Fetched result:', result);  // Log the entire result object
  
      if (response.ok) {
        // If the response contains the expected data inside a key (e.g., `cycleHistory`), use it
        if (result && result.cycleHistory && Array.isArray(result.cycleHistory)) {
          // Reverse the array so the latest cycle is first
          const mappedData = result.cycleHistory.map((cycle) => ({
            cycleNumber: cycle.cycle,
            startDate: cycle.period_start,
            mensesLength: cycle.period_length,
            cycleLength: cycle.cycle_length,
          }));
  
          // No need to reverse the array now, latest cycle will be first by default
          setCycleHistory(mappedData); 
        } else {
          console.error('Error: cycleHistory not found or not an array in the response:', result);
        }
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
    } else {
      // If no cycle history, use current cycle length and menses length as averages
      setAverageCycleLength(cycleLength);
      setAverageMensesLength(mensesLength);
    }
  }, [cycleHistory, cycleLength, mensesLength]);

  // Calculate average length of a specific field (cycleLength or mensesLength)
  const calculateAverage = (field) => {
    if (cycleHistory.length === 0) return 0;

    const total = cycleHistory.reduce((acc, cycle) => acc + cycle[field], 0);
    const average = total / cycleHistory.length;

      // Round to nearest whole number before returning
    return Math.round(average);
  };

  const calculateCycleLength = (startDate, previousCycleStartDate) => {
    const currentStartDate = new Date(startDate);
    const previousStartDate = new Date(previousCycleStartDate);
    
    const timeDifference = currentStartDate - previousStartDate; // Time difference in milliseconds
    const dayInMs = 1000 * 60 * 60 * 24; // Convert milliseconds to days
    return Math.floor(timeDifference / dayInMs); // Return the difference in days
  };
  
  // Function to calculate fertile window (5 days before and 1 day after ovulation)
  const calculateFertileWindow = (ovulationDate) => {
    if (!ovulationDate) return '';

    const ovulation = new Date(ovulationDate);
    const startFertileWindow = new Date(ovulation);
    const endFertileWindow = new Date(ovulation);

    startFertileWindow.setDate(ovulation.getDate() - 5); // 5 days before ovulation
    endFertileWindow.setDate(ovulation.getDate() + 1);   // 1 day after ovulation

    return `${startFertileWindow.toDateString()} - ${endFertileWindow.toDateString()}`;
  };

  // Form validation function
  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    const currentDate = new Date();
    const inputStartDate = new Date(startDate);
    if (!startDate || inputStartDate > currentDate) {
      formErrors.startDate = 'Start date must be a valid date in the past.';
      isValid = false;
    }

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
      
      // Calculate the cycle length from the difference in start dates
      const calculatedCycleLength = Math.floor((newCycleStartDate - lastCycleStartDate) / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
      // Check if the calculated cycle length matches the entered cycle length
      if (calculatedCycleLength !== parseInt(cycleLength)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          cycleLength: `The calculated cycle length (${calculatedCycleLength} days) does not match the entered cycle length. Please check your dates.`,
        }));
        return;
      }
    }

    // Calculate the cycle number (1 if no history, else the next number based on history length)
    const cycleNumber = cycleHistory.length === 0 ? 1 : cycleHistory.length + 1;

    const cycleData = {
      email: email,  // Add the email
      startDate,
      cycleLength: parseInt(cycleLength),
      mensesLength: parseInt(mensesLength),
      averageCycleLength: averageCycleLength,
      averageMensesLength: averageMensesLength || mensesLength,
      cycleNumber,  // Add cycle number
    };
    

    try {
      const response = await fetch('http://localhost:5000/predict-cycle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cycleData),
      });

      const result = await response.json();

      if (result.nextMensesDate && result.ovulationDate) {
        setNextMensesDate(result.nextMensesDate);
        setOvulationDate(result.ovulationDate);
        setFertileWindow(calculateFertileWindow(result.ovulationDate));
      } else {
        console.error('Error in prediction:', result.error);
      }
    } catch (error) {
      console.error('Error calling backend:', error);
    }

    // Add the new cycle data to the history
    const newCycle = {
      email: email,
      startDate,
      cycleLength: parseInt(cycleLength),
      mensesLength: parseInt(mensesLength),
      cycleNumber, // Add cycle number to the new cycle
    };

    setCycleHistory([...cycleHistory, newCycle]);

    // Save to backend
    saveCycleToDB(newCycle);

    setStartDate('');
    setCycleLength('');
    setMensesLength('');
  };

  // Save cycle data to the backend
  const saveCycleToDB = async (newCycle) => {
    const email = localStorage.getItem('email'); // Get email from localStorage
    if (!email) {
      console.error('Email is missing from localStorage');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:5000/save_cycle_data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newCycle, // Spread the new cycle data
          email: email, // Ensure email is sent
        }),
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

  const handlePrev = () => {
    if (currentOffset > 0) {
      setCurrentOffset(currentOffset - 3); // Move backward by 3
    }
  };
  
  const handleNext = () => {
    if (currentOffset + 3 < cycleHistory.length) {
      setCurrentOffset(currentOffset + 3); // Move forward by 3
    }
  };
  

  return (
    <div>
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
            <label htmlFor="start-date">When did your last period start?</label>
            <input
              type="date"
              id="start-date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
            {errors.startDate && <p className="error">{errors.startDate}</p>}

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
              {cycleHistory.slice(currentOffset, currentOffset + 3).map((cycle, index) => (
                <tr key={index}>
                  <td>{cycle.cycleNumber}</td>
                  <td>{new Date(cycle.startDate).toLocaleDateString()}</td>
                  <td>{cycle.cycleLength} Days</td>
                  <td>{cycle.mensesLength} Days</td>
                </tr>
              ))}
            </tbody>


          </table>
          <div className="pagination-controls">
            <button onClick={handlePrev} disabled={currentOffset === 0}>← Previous</button>
            <button onClick={handleNext} disabled={currentOffset + 3 >= cycleHistory.length}>Next →</button>
          </div>
        </section>
      </div>
      <footer>
        <p>Contact us: support@pcosmanagement.com</p>
        <p>Legal Disclaimer: This information is for educational purposes and not a substitute for medical advice.</p>
      </footer>
    </div>
  );
};

export default PeriodTracker;
