import React from 'react';
import '../styles/About.css'; // Import a CSS file for styling

const About = () => {
  return (
    <div className="about-container">
      <h1>About FemPredict</h1>
      <p>
        FemPredict is a web platform designed to empower women with the tools and knowledge
        needed to manage and track their health, particularly focusing on conditions like
        Polycystic Ovary Syndrome (PCOS). Our mission is to provide easy-to-use tools and
        resources that help women make informed decisions about their health.
      </p>

      <h2>Our Vision</h2>
      <p>
        We aim to create a supportive community and provide science-backed tools to help women
        track their menstrual cycles, calculate PCOS risk, recommend personalized exercises, and
        more. Our goal is to help women achieve better health and wellness through awareness
        and proactive management of conditions like PCOS.
      </p>

      <h2>Features</h2>
      <ul>
        <li>PCOS Risk Calculator</li>
        <li>Period Tracker</li>
        <li>Exercise Recommender</li>
        <li>Health Tips and Resources</li>
      </ul>

      <h2>Why Choose FemPredict?</h2>
      <p>
        With FemPredict, you gain access to personalized insights and actionable advice. Our
        platform uses proven methodologies to calculate your PCOS risk and recommend
        customized solutions that suit your needs.
      </p>

      <h2>Contact Us</h2>
      <p>
        Have questions or feedback? Reach out to us at: <a href="mailto:contact@fempredict.com">contact@fempredict.com</a>
      </p>
    </div>
  );
};

export default About;
