import axios from 'axios';
import { useState } from 'react';

const Tracker = () => {
  const [lastMensesDate, setLastMensesDate] = useState('');
  const [MeanMensesLength, setMeanMensesLength] = useState('');
  const [MeanCycleLength, setMeanCycleLength] = useState('');
  const [LengthofCycle, setLengthofCycle] = useState('');
  const [LengthofMenses, setLengthofMenses] = useState('');
  const [error, setError] = useState('');
  const [ovulationDate, setOvulationDate] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setOvulationDate('');

    // Validate all fields (check for empty and valid numeric values)
    if (!lastMensesDate || !MeanMensesLength || !MeanCycleLength || !LengthofCycle || !LengthofMenses) {
      setError('Please fill all fields');
      return;
    }

    // Ensure that fields which should be numbers are actually numbers
    const parsedMeanMensesLength = parseInt(MeanMensesLength);
    const parsedMeanCycleLength = parseInt(MeanCycleLength);
    const parsedLengthofCycle = parseInt(LengthofCycle);
    const parsedLengthofMenses = parseInt(LengthofMenses);

    if (isNaN(parsedMeanMensesLength) || isNaN(parsedMeanCycleLength) || isNaN(parsedLengthofCycle) || isNaN(parsedLengthofMenses)) {
      setError('Please provide valid numeric values for all fields.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/predict_ovulation', {
        startDate: lastMensesDate,
        LengthofCycle: parsedLengthofCycle,
        LengthofMenses: parsedLengthofMenses,
        MeanMensesLength: parsedMeanMensesLength,
        MeanCycleLength: parsedMeanCycleLength,
      });

      // Extracting the predicted ovulation date from the response
      const { predictedOvulationDate } = response.data;

      // Format the ovulation date
      setOvulationDate(new Date(predictedOvulationDate).toLocaleDateString());

    } catch (error) {
      setError('An error occurred. Please try again later.');
      console.error(error);
    }
  };

  return (
    <div className="tracker-container" style={{ display: 'flex', alignItems: 'flex-start' }}>
      <div style={{ flex: 1 }}>
        <h2>Menstrual Cycle Tracker</h2>
        <form onSubmit={handleSubmit} className="tracker-form">
          <label>When did your last period start?</label>
          <input type="date" value={lastMensesDate} onChange={(e) => setLastMensesDate(e.target.value)} required />

          <label>How many days did your period last?</label>
          <input type="number" value={LengthofMenses} onChange={(e) => setLengthofMenses(e.target.value)} required min="1" />

          <label>How long is your menstrual cycle?</label>
          <input type="number" value={LengthofCycle} onChange={(e) => setLengthofCycle(e.target.value)} required min="1" />

          <label>What is your average period length?</label>
          <input type="number" value={MeanMensesLength} onChange={(e) => setMeanMensesLength(e.target.value)} required min="1" />

          <label>What is your average cycle length?</label>
          <input type="number" value={MeanCycleLength} onChange={(e) => setMeanCycleLength(e.target.value)} required min="1" />

          {error && <div className="error-message">{error}</div>}

          <button type="submit" style={{ marginTop: '10px' }}>Submit</button>
        </form>
      </div>

      <div className="results" style={{ textAlign: 'center' }}>
        {ovulationDate && (
          <div className="ovulation-date">
            <h4>Predicted Ovulation Date: {ovulationDate}</h4>
          </div>
        )}
      </div>

      {/* Displaying the image */}
      <img src="periods.png" alt="Cycle Tracker" style={{ width: '600px', height: 'auto', marginLeft: '20px', marginTop: '20px' }} />
    </div>
  );
};

export default Tracker;
