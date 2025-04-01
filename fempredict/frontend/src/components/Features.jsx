import React from 'react';
import '../styles/Features.css';

const Features = () => {
  return (
    <section className="features-section">
      <h2>Features</h2>
      <div className="feature-item">
        <h3>PCOS Risk Calculator</h3>
        <p>Estimate your risk for PCOS by providing key details about your health. This tool can help you understand your potential risk factors and take proactive steps.</p>
      </div>
      <div className="feature-item">
        <h3>Period Tracker</h3>
        <p>Track your menstrual cycle with precision and get personalized insights to help you manage your health better.</p>
      </div>
      <div className="feature-item">
        <h3>Chatbot</h3>
        <p>Engage in intelligent, human-like conversations with our chatbot. Powered by advanced AI, it can understand and respond to a wide range of questions, offering helpful information and personalized support.</p>
      </div>
      <div className="feature-item">
        <h3>Exercise Recommendations</h3>
        <p>Receive tailored exercise routines based on your health goals and preferences. These routines are designed to enhance your well-being and help you stay fit, regardless of your fitness level.</p>
      </div>
    </section>
  );
};

export default Features;
