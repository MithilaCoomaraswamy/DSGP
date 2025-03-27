import React from "react";
import { useNavigate } from "react-router-dom";
import "./ChatbotLanding.css";

const ChatbotLanding = () => {
  const navigate = useNavigate();  // Use useNavigate instead of useHistory

  // Navigate to Chatbot page when the button is clicked
  const handleGetStarted = () => {
    navigate("/chatbot");  // Use navigate() instead of history.push()
  };

  return (
    <div className="container">
      <div className="content">



        <div className="text">
          <h1 className="highlight">WELCOME TO
          FEMPREDICT BOT..</h1>

          <p className="text-description">
              Our FemPredict Bot is a virtual assistant designed to help users manage and understand Polycystic Ovary Syndrome. Get started by clicking the button below.
          </p>
          <button
            onClick={handleGetStarted}
            className="get-started"
          >
            Get Started
          </button>
        </div>


        <div className="image">
          <img
            src="/image/bot.jpg"
            alt="Chatbot"
            className="image-img"
          />
        </div>

      </div>
    </div>
  );
};

export default ChatbotLanding;
