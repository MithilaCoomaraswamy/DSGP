import axios from 'axios';
import { useState } from 'react';

const Tracker = () => {
  const [lastMensesDate, setLastMensesDate] = useState('');
  const [avgMensesLength, setAvgMensesLength] = useState('');
  const [avgCycleLength, setAvgCycleLength] = useState('');
  const [cycleNumber, setCycleNumber] = useState(''); // New state for cycle number
  const [cycleLength, setCycleLength] = useState(''); // New state for cycle length
  const [error, setError] = useState('');
  const [ovulationDate, setOvulationDate] = useState('');
  const [chartData, setChartData] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setChartData(null);
    setOvulationDate('');

    if (!lastMensesDate || !avgMensesLength || !avgCycleLength || !cycleNumber || !cycleLength) {
      setError('Please fill all fields');
      return;
    }

    try {
      // Send data to backend API
      const response = await axios.post('http://localhost:5000/predict', {
        lastMensesDate,
        avgMensesLength: parseInt(avgMensesLength),
        avgCycleLength: parseInt(avgCycleLength),
        cycleNumber: parseInt(cycleNumber), // Include cycleNumber in request
        cycleLength: parseInt(cycleLength), // Include cycleLength in request
      });

      // Set the predicted ovulation date
      setOvulationDate(response.data.ovulationDate);

      const startDate = new Date(lastMensesDate);
      const cycleLengthInt = parseInt(cycleLength);
      const mensesLength = parseInt(avgMensesLength);
      
      // Dynamic luteal phase length based on cycle length
      const lutealPhaseLength = cycleLengthInt <= 24 ? 12 : cycleLengthInt >= 30 ? 16 : 14;
      const follicularPhaseLength = cycleLengthInt - mensesLength - lutealPhaseLength;

      const phaseData = Array.from({ length: cycleLengthInt }, (_, i) => {
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
    } catch (error) {
      console.error('Error predicting ovulation date:', error);
      setError('Failed to get prediction');
    }
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

        {/* New input fields for Cycle Number and Cycle Length */}
        <label>Cycle Number</label>
        <input type="number" value={cycleNumber} onChange={(e) => setCycleNumber(e.target.value)} required min="1" />

        <label>Cycle Length (days)</label>
        <input type="number" value={cycleLength} onChange={(e) => setCycleLength(e.target.value)} required min="1" />

        {error && <div className="error-message">{error}</div>}
        <button type="submit">Submit</button>
      </form>
      
      {ovulationDate && (
        <div>
          <h3>Predicted Ovulation Date: {ovulationDate}</h3>
        </div>
      )}

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
