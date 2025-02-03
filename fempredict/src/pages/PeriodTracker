import React, { useState } from 'react';
import moment from 'moment';

function PeriodTracker() {
  const [startDate, setStartDate] = useState('');
  const [menstrualLength, setMenstrualLength] = useState('');
  const [cycleLength, setCycleLength] = useState('');
  const [nextPeriod, setNextPeriod] = useState('');
  const [ovulationDay, setOvulationDay] = useState('');
  const [error, setError] = useState('');

  // Calculate the next period date based on user input
  const calculateNextPeriod = () => {
    const start = moment(startDate, 'YYYY-MM-DD');
    const nextPeriodStart = start.add(parseInt(cycleLength), 'days');
    setNextPeriod(nextPeriodStart.format('YYYY-MM-DD'));
  };

  // Call the backend API to get the estimated ovulation date
  const fetchOvulationDate = async () => {
    setError('');
    if (!startDate || !menstrualLength || !cycleLength) {
      setError('Please fill all the fields.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lastStartDate: startDate,
          menstrualLength: menstrualLength,
          cycleLength: cycleLength,
        }),
      });

      const data = await response.json();
      setOvulationDay(data.estimatedOvulationDate);
    } catch (error) {
      setError('Error fetching ovulation date from the backend.');
      console.error(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    calculateNextPeriod();
    fetchOvulationDate();
  };

  return (
    <div>
      <h1>Period Tracker</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="startDate">Last Start Date: </label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="menstrualLength">Average Menstrual Length (days): </label>
          <input
            type="number"
            id="menstrualLength"
            value={menstrualLength}
            onChange={(e) => setMenstrualLength(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="cycleLength">Average Cycle Length (days): </label>
          <input
            type="number"
            id="cycleLength"
            value={cycleLength}
            onChange={(e) => setCycleLength(e.target.value)}
          />
        </div>
        <button type="submit">Calculate</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {nextPeriod && (
        <div>
          <h2>Results</h2>
          <p>Next Period Start Date: {nextPeriod}</p>
          <p>Estimated Ovulation Day: {ovulationDay}</p>
        </div>
      )}
    </div>
  );
}

export default PeriodTracker;
