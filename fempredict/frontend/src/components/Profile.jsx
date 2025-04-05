import React from 'react';
import { useNavigate } from 'react-router-dom'; // Importing useNavigate for navigation
import '../styles/Profile.css'; // Import a CSS file for styling

const Profile = () => {
  const navigate = useNavigate(); // Initialize navigate function

  // Features data
  const features = [
    {
      title: "PCOS Risk Calculator",
      description: "Assess your risk for PCOS with a personalized risk calculator.",
      icon: "👩‍⚕️",
      path: "/pcos-risk-calculator", // Route for this card
    },
    {
      title: "Period Tracker",
      description: "Keep track of your menstrual cycle with ease.",
      icon: "📅",
      path: "/period-tracker", // Route for this card
    },
    {
      title: "Exercise Recommender",
      description: "Get personalized exercise recommendations for better health.",
      icon: "🏋️‍♀️",
      path: "/exercise-recommender", // Route for this card
    },
    {
      title: "Health Chatbot",
      description: "Get instant answers and health tips from our intelligent chatbot.",
      icon: "🤖",
      path: "/chatbot", // Route for this card
    }
  ];

  // Function to handle button click and navigate to the appropriate page
  const handleButtonClick = (path) => {
    navigate(path); // Navigates to the specified path
  };

  return (
    <div className="feature-cards-container">
      {features.map((feature, index) => (
        <div className="feature-card" key={index}>
          <div className="card-icon">{feature.icon}</div>
          <h3>{feature.title}</h3>
          <p>{feature.description}</p>
          {/* Button to navigate */}
          <button onClick={() => handleButtonClick(feature.path)} className="card-button">
            Go to {feature.title}
          </button>
        </div>
      ))}
    </div>
  );
};

export default Profile;
