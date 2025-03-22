import React, { useState } from 'react';
import '../styles/Chatbot.css';

const Chatbot = () => { 

  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => setUserInput(e.target.value);

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    setMessages([...messages, { text: userInput, sender: "user" }]);
    setUserInput("");
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userInput }),
      });

      const data = await response.json();
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: data.response, sender: "bot" },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "Error connecting to chatbot.", sender: "bot" },
      ]);
    }

    setLoading(false);
  };

  return (
    <div>
    <div className="chatbot-container">
      <div className="chatbot-header">What can I help you with?</div>
      <div className="chatbot-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message-container ${msg.sender}`}>
            {msg.sender === "bot" && (
              <img src="/images/bot-icon.png" alt="Bot" className="chat-icon bot-icon" />
            )}
            <div className={`message ${msg.sender}-message`}>{msg.text}</div>
            {msg.sender === "user" && (
              <img src="/images/user-icon.png" alt="User" className="chat-icon user-icon" />
            )}
          </div>
        ))}
        {loading && <div className="typing-indicator">...</div>}
      </div>
      <div className="chatbot-input">
        <input
          type="text"
          value={userInput}
          onChange={handleInputChange}
          placeholder="Type your message..."
        />
        <button onClick={handleSendMessage}>
          <img src="/images/send.png" alt="Send" />
        </button>
      </div>
    </div>
    <footer>
      <p>Contact us: support@pcosmanagement.com</p>
      <p>Legal Disclaimer: This information is for educational purposes and not a substitute for medical advice.</p>
    </footer>
    </div>
  );
};

export default Chatbot;