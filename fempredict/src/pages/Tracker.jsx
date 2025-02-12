import React, { useState } from 'react';

const Tracker = () => {
  const [lastMensesDate, setLastMensesDate] = useState('');
  const [avgMensesLength, setAvgMensesLength] = useState('');
  const [avgCycleLength, setAvgCycleLength] = useState('');
  const [error, setError] = useState('');
  const [chartData, setChartData] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setChartData(null);

    if (!lastMensesDate || !avgMensesLength || !avgCycleLength) {
      setError('Please fill all fields');
      return;
    }

    const startDate = new Date(lastMensesDate);
    const cycleLength = parseInt(avgCycleLength);
    const mensesLength = parseInt(avgMensesLength);
    const follicularPhaseLength = cycleLength - mensesLength - 14;
    const lutealPhaseLength = 14;

    const phaseData = Array.from({ length: cycleLength }, (_, i) => {
      let phase, fill;
      if (i < mensesLength) {
        phase = 'Menstruation';
        fill = '#FF5959';
      } else if (i < mensesLength + follicularPhaseLength) {
        phase = 'Follicular';
        fill = '#FF9F1C';
      } else if (i === mensesLength + follicularPhaseLength) {
        phase = 'Ovulation';
        fill = '#FFC300';
      } else {
        phase = 'Luteal';
        fill = '#8CC8FF';
      }
      return {
        day: i + 1,
        phase,
        fill,
        date: new Date(startDate.setDate(startDate.getDate() + (i === 0 ? 0 : 1))).toLocaleDateString()
      };
    });

    setChartData(phaseData);
  };

  return (
    <div className="tracker-container">
      <h2>Menstrual Cycle Tracker</h2>
      <form onSubmit={handleSubmit} className="tracker-form">
        <div>
          <label>Date of Last Menses</label>
          <input type="date" value={lastMensesDate} onChange={(e) => setLastMensesDate(e.target.value)} required />
        </div>
        <div>
          <label>Average Menses Length (days)</label>
          <input type="number" value={avgMensesLength} onChange={(e) => setAvgMensesLength(e.target.value)} required min="1" />
        </div>
        <div>
          <label>Average Cycle Length (days)</label>
          <input type="number" value={avgCycleLength} onChange={(e) => setAvgCycleLength(e.target.value)} required min="1" />
        </div>
        {error && <div className="error-message">{error}</div>}
        <button type="submit">Submit</button>
      </form>
      {selectedDate && <h3>Selected Date: {selectedDate}</h3>}
      {chartData && (
        <div className="chart-container" style={{ textAlign: 'center' }}>
          <h3>Menstrual Cycle Phases</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px' }}>
            {chartData.map((item) => (
              <div
                key={item.day}
                style={{
                  padding: '10px',
                  borderRadius: '5px',
                  backgroundColor: item.fill,
                  color: '#fff',
                  cursor: 'pointer'
                }}
                onClick={() => {
                  setSelectedDay(item.day);
                  setSelectedDate(item.date);
                }}
              >
                <strong>Day {item.day}</strong>
                <br />
                {item.phase}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Tracker;
