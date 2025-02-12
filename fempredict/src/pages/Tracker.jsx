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
    <div className="tracker-container" style={{ textAlign: 'center' }}>
      <h2>Menstrual Cycle Tracker</h2>
      <form onSubmit={handleSubmit} className="tracker-form">
        <label>Date of Last Menses</label>
        <input type="date" value={lastMensesDate} onChange={(e) => setLastMensesDate(e.target.value)} required />

        <label>Average Menses Length (days)</label>
        <input type="number" value={avgMensesLength} onChange={(e) => setAvgMensesLength(e.target.value)} required min="1" />

        <label>Average Cycle Length (days)</label>
        <input type="number" value={avgCycleLength} onChange={(e) => setAvgCycleLength(e.target.value)} required min="1" />

        {error && <div className="error-message">{error}</div>}
        <button type="submit">Submit</button>
      </form>
      
      {chartData && (
        <div style={{ position: 'relative', width: '450px', height: '450px', margin: '30px auto' }}>
          {chartData.map((item, index) => {
            const angle = (360 / chartData.length) * index;
            const x = 200 + Math.cos((angle * Math.PI) / 180) * 180;
            const y = 200 + Math.sin((angle * Math.PI) / 180) * 180;
            return (
              <div
                key={item.day}
                style={{
                  position: 'absolute',
                  left: `${x}px`,
                  top: `${y}px`,
                  backgroundColor: item.fill,
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
                onClick={() => {
                  setSelectedDay(item.day);
                  setSelectedDate(item.date);
                }}
              >
                {item.day}
              </div>
            );
          })}

          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '150px',
              height: '150px',
              backgroundColor: '#fff',
              borderRadius: '50%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)'
            }}
          >
            {selectedDate ? (
              <>
                <h4>{chartData[selectedDay - 1]?.phase}</h4>
                <p>{selectedDate}</p>
              </>
            ) : (
              <>
                <h4>Select a Day</h4>
                <p>Click on a day to see details</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Tracker;
