import React, { useState } from "react";
import "./Chatbot.css";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");

  // Handle user input
  const handleInputChange = (e) => setUserInput(e.target.value);

  // Handle send button click
  const handleSendMessage = () => {
    if (userInput.trim()) {
      setMessages([
        ...messages,
        { text: userInput, sender: "user" },
        { text: "Bot response will be here", sender: "bot" }, // Placeholder for bot response
      ]);
      setUserInput(""); // Clear input field
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">What can I help with?</div>
      <div className="chatbot-messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={msg.sender === "user" ? "user-message" : "bot-message"}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className="chatbot-input">
        <input
          type="text"
          value={userInput}
          onChange={handleInputChange}
          placeholder="Type your message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chatbot;
