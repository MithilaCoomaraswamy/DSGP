
import React, { useState } from 'react';
import '../Styles/Exercise.css';
import Image11 from '../Image1/11.jpg';
import Image22 from '../image2/22.jpg';

export default function Recommender() {
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
      const response = await fetch('http://localhost:5000/predict', {
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

      <div className = "Main-Topic">
        <h1>Empowering Your PCOS Journey with Fitness</h1>
      </div>

      <div className='Image1'>
      <img src={Image11} alt="PCOS Exercise" />
      </div>

      <div className='recommender-topic'>
      
        <h1>Welcome to FemPredict Personalized Exercise Recommender!</h1>
        <p>Your journey to a healthier and more vibrant life begins here. For women with PCOS, staying active through regular exercise isn't just about fitness—it's a powerful tool to manage symptoms and improve overall well-being.</p>
        <p>Exercise helps regulate hormones, enhance insulin sensitivity, and reduce the risks associated with PCOS, including weight gain, mood swings, and fatigue.</p>
        <p>At FemPredict, we believe that a tailored workout plan, designed specifically for your needs, can transform your daily routine, boost your energy, and guide you towards living your best life.</p>
        <p>Start your journey today, because a healthy body leads to a happier you!</p>
      </div>

      <div className='Form-Topic'>
        <h1>Get Your Personalized Exercise Plan from Here</h1>
      </div>

      <div className='Image2'>
      <img src={Image22} alt="PCOS Exercise 2" />
      </div>

      <div className='input-container'>
        <h2>Enter Your Details</h2>
        <form onSubmit={handleSubmit}>
          <div className='input-group'>
            <label>Weight (kg):</label>
            <input
              type='number'
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              required
              min='1'
              placeholder='Enter weight'
            />
          </div>

          <div className='input-group'>
            <label>Height (m):</label>
            <input
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
            <label>Age (years):</label>
            <input
              type='number'
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
              min='1'
              placeholder='Enter age'
            />
          </div>

          <div className='input-group'>
            <label>Workout Preference:</label>
            <select
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
    </div>
  );
}

