import React, { useState } from 'react';
import '../styles/PCOSRiskCalculator.css'; // Make sure to create the CSS file for styling

const PCOSRiskCalculator = () => {
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [symptoms, setSymptoms] = useState({
    irregularPeriods: false,
    acne: false,
    hairLoss: false,
    excessHairGrowth: false,
  });
  const [result, setResult] = useState(null);

  // Handle input change for age, weight, and height
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'age') setAge(value);
    if (name === 'weight') setWeight(value);
    if (name === 'height') setHeight(value);
  };

  // Handle checkbox change for symptoms
  const handleSymptomChange = (e) => {
    const { name, checked } = e.target;
    setSymptoms((prevSymptoms) => ({
      ...prevSymptoms,
      [name]: checked,
    }));
  };

  // Calculate the risk based on the user inputs
  const calculateRisk = () => {
    const bmi = (weight / (height * height)).toFixed(1); // BMI = weight / height^2
    let riskLevel = 'Low';

    // Simple risk logic based on symptoms
    if (age > 30 || symptoms.irregularPeriods || symptoms.acne || symptoms.hairLoss) {
      riskLevel = 'Moderate';
    }
    if (bmi >= 30 || symptoms.excessHairGrowth) {
      riskLevel = 'High';
    }

    setResult({
      bmi,
      riskLevel,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    calculateRisk();
  };

  return (
    <div>
    <div className="pcos-risk-calculator">
      <h2>PCOS Risk Calculator</h2>
      <p>Answer the following questions to calculate your PCOS risk.</p>

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="age">Age:</label>
          <input
            type="number"
            id="age"
            name="age"
            value={age}
            onChange={handleInputChange}
            required
            min="18"
          />
        </div>

        <div className="input-group">
          <label htmlFor="weight">Weight (kg):</label>
          <input
            type="number"
            id="weight"
            name="weight"
            value={weight}
            onChange={handleInputChange}
            required
            min="1"
          />
        </div>

        <div className="input-group">
          <label htmlFor="height">Height (m):</label>
          <input
            type="number"
            id="height"
            name="height"
            value={height}
            onChange={handleInputChange}
            required
            min="0.5"
            step="0.01"
          />
        </div>

        <div className="symptoms">
          <h3>Do you experience any of the following symptoms?</h3>
          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                name="irregularPeriods"
                checked={symptoms.irregularPeriods}
                onChange={handleSymptomChange}
              />
              Irregular Periods
            </label>
            <label>
              <input
                type="checkbox"
                name="acne"
                checked={symptoms.acne}
                onChange={handleSymptomChange}
              />
              Acne
            </label>
            <label>
              <input
                type="checkbox"
                name="hairLoss"
                checked={symptoms.hairLoss}
                onChange={handleSymptomChange}
              />
              Hair Loss
            </label>
            <label>
              <input
                type="checkbox"
                name="excessHairGrowth"
                checked={symptoms.excessHairGrowth}
                onChange={handleSymptomChange}
              />
              Excessive Hair Growth
            </label>
          </div>
        </div>

        <button type="submit" className="submit-btn">Calculate Risk</button>
      </form>

      {result && (
        <div className="result">
          <h3>Result:</h3>
          <p><strong>BMI:</strong> {result.bmi}</p>
          <p><strong>Risk Level:</strong> {result.riskLevel}</p>
        </div>
      )}
    </div>
    <footer>
      <p>Contact us: support@pcosmanagement.com</p>
      <p>Legal Disclaimer: This information is for educational purposes and not a substitute for medical advice.</p>
    </footer>
    </div>
  );
};

export default PCOSRiskCalculator;
