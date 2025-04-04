import React, { useState } from 'react';
import '../styles/ExerciseRecommender.css';

const ExerciseRecommender = () => { 

  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [preference, setPreference] = useState('');
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!weight || !height || !age || !preference) {
      alert('Please fill all fields correctly.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weight, height, age, preference })
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        alert(data.error || 'An error occurred.');
      }
    } catch (error) {
      alert('Server not responding. Please try again later.');
    }
  };

  return (
    <div className='recommender-body'>
      <div className='recommender-topic'>
        <h1>Welcome to FemPredict Personalized Exercise Recommender!</h1>
        <p>Your journey to a healthier and more vibrant life begins here. For women with PCOS, staying active through regular exercise isn't just about fitness—it's a powerful tool to manage symptoms and improve overall well-being.</p>
        <p>Exercise helps regulate hormones, enhance insulin sensitivity, and reduce the risks associated with PCOS, including weight gain, mood swings, and fatigue.</p>
        <p>At FemPredict, we believe that a tailored workout plan, designed specifically for your needs, can transform your daily routine, boost your energy, and guide you towards living your best life.</p>
        <p>Start your journey today, because a healthy body leads to a happier you!</p>
      </div>

      <div className='input-container'>
        <h2>Enter Your Details</h2>
        <form onSubmit={handleSubmit}>
          <div className='input-group'>
            <label htmlFor='weight'>Weight (kg):</label>
            <input
              id='weight'
              type='number'
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              required
              min='1'
              placeholder='Enter weight'
            />
          </div>

          <div className='input-group'>
            <label htmlFor='height'>Height (m):</label>
            <input
              id='height'
              type='number'
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              required
              min='0.1'
              step='0.01'
              placeholder='Enter height'
            />
          </div>

          <div className='input-group'>
            <label htmlFor='age'>Age (years):</label>
            <input
              id='age'
              type='number'
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
              min='1'
              placeholder='Enter age'
            />
          </div>

          <div className='input-group'>
            <label htmlFor='preference'>Workout Preference:</label>
            <select
              id='preference'
              value={preference}
              onChange={(e) => setPreference(e.target.value)}
              required
            >
              <option value=''>Select preference</option>
              <option value='gym'>Gym</option>
              <option value='home'>Home</option>
            </select>
          </div>

          <button type='submit' className='submit-button'>Get Exercise Plan</button>
        </form>

        {result && (
          <div className='result-container'>
            <h3>Results:</h3>
            <p><strong>BMI:</strong> {result.bmi}</p>
            <p><strong>BMI Category:</strong> {result.bmi_case}</p>
            <p><strong>Recommended Exercise:</strong> {result.exercise}</p>
          </div>
        )}
      </div>

      <footer>
          <p>Contact us: support@pcosmanagement.com</p>
          <p>Legal Disclaimer: This information is for educational purposes and not a substitute for medical advice.</p>
      </footer>
    </div>
  );
}

export default ExerciseRecommender;
