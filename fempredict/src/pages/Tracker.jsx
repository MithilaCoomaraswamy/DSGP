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
        <div className="chart-container" style={{ textAlign: 'center', position: 'relative' }}>
          <h3>Menstrual Cycle Phases</h3>
          <div
            style={{
              position: 'relative',
              width: '400px',  // Fixed circle size
              height: '400px', // Fixed circle size to maintain aspect ratio
              margin: '0 auto',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexWrap: 'wrap',
                transform: 'rotate(0deg)', // No rotation of the elements
              }}
            >
              {chartData.map((item, index) => {
                const angle = (360 / chartData.length) * index; // Angle calculation for each box
                const translateX = Math.cos((angle * Math.PI) / 180) * 160; // X position along the circle
                const translateY = Math.sin((angle * Math.PI) / 180) * 160; // Y position along the circle

                return (
                  <div
                    key={item.day}
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      transform: `translate(-50%, -50%) translate(${translateX}px, ${translateY}px)`,
                      padding: '10px',
                      borderRadius: '50%', // Circular shape
                      backgroundColor: item.fill,
                      color: '#fff',
                      cursor: 'pointer',
                      textAlign: 'center',
                      width: '50px', // Fixed size for the boxes, big enough to fit two digits
                      height: '50px', // Fixed height for boxes
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    onClick={() => {
                      setSelectedDay(item.day);
                      setSelectedDate(item.date);
                    }}
                  >
                    <strong>{item.day}</strong>
                  </div>
                );
              })}
            </div>

            {/* Middle circle for displaying phase names */}
            {selectedDate && (
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  padding: '20px',
                  backgroundColor: '#fff',
                  borderRadius: '50%',
                  textAlign: 'center',
                  width: '200px', // Fixed size for the middle circle
                  height: '200px', // Fixed size for the middle circle
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <div>
                  <h4>{chartData[selectedDay - 1]?.phase}</h4>
                  <p>{selectedDate}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Tracker;
