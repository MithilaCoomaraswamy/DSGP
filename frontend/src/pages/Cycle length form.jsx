import React, { useState } from 'react';

const CycleLengthForm = () => {
  const [lastPeriod, setLastPeriod] = useState('');
  const [twoPeriodsAgo, setTwoPeriodsAgo] = useState('');
  const [threePeriodsAgo, setThreePeriodsAgo] = useState('');
  const [averageCycleLength, setAverageCycleLength] = useState(null);
  const [error, setError] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setAverageCycleLength(null);

    // Validate that all fields are filled
    if (!lastPeriod || !twoPeriodsAgo || !threePeriodsAgo) {
      setError('Please fill all date fields');
      return;
    }

    // Parse dates
    const lastPeriodDate = new Date(lastPeriod);
    const twoPeriodsAgoDate = new Date(twoPeriodsAgo);
    const threePeriodsAgoDate = new Date(threePeriodsAgo);

    // Calculate cycle lengths between the dates
    const cycleLength1 = Math.ceil((lastPeriodDate - twoPeriodsAgoDate) / (1000 * 3600 * 24)); // Days between two periods
    const cycleLength2 = Math.ceil((twoPeriodsAgoDate - threePeriodsAgoDate) / (1000 * 3600 * 24)); // Days between two periods ago and three periods ago

    // Check if any cycle length is invalid
    if (isNaN(cycleLength1) || isNaN(cycleLength2)) {
      setError('Please enter valid dates.');
      return;
    }

    // Calculate average cycle length
    const average = (cycleLength1 + cycleLength2) / 2;
    setAverageCycleLength(average);
  };

  return (
    <div>
      <h2>Calculate Your Average Cycle Length</h2>
      <form onSubmit={handleSubmit}>
        <label>Last Period - Day 1</label>
        <input
          type="date"
          value={lastPeriod}
          onChange={(e) => setLastPeriod(e.target.value)}
          required
        />

        <label>Two Periods Ago - Day 1</label>
        <input
          type="date"
          value={twoPeriodsAgo}
          onChange={(e) => setTwoPeriodsAgo(e.target.value)}
          required
        />

        <label>Three Periods Ago - Day 1</label>
        <input
          type="date"
          value={threePeriodsAgo}
          onChange={(e) => setThreePeriodsAgo(e.target.value)}
          required
        />

        {error && <div style={{ color: 'red' }}>{error}</div>}

        <button type="submit">Calculate Average Cycle Length</button>
      </form>

      {averageCycleLength && (
        <div>
          <h3>Average Cycle Length:</h3>
          <p>{averageCycleLength} days</p>
        </div>
      )}
    </div>
  );
};

export default CycleLengthForm;
