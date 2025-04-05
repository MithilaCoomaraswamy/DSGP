import React, { useState, useEffect, useRef } from 'react';
import '../styles/Chatbot.css';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);  // Ref to automatically scroll to latest message

  const handleInputChange = (e) => setUserInput(e.target.value);

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    setMessages((prevMessages) => [
      ...prevMessages,
      { text: userInput, sender: 'user' },
    ]);
    setUserInput('');
    setLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:5000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userInput }),
      });

      const data = await response.json();
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: data.response, sender: 'bot' },
      ]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: 'Error connecting to chatbot.', sender: 'bot' },
      ]);
    }

    setLoading(false);
  };

  // Add an event listener for "Enter" key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage(); // Trigger send message when Enter is pressed
    }
  };

  // Scroll to the bottom of messages when a new message is added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div>
      <div className="chatbot-container">
        <div className="chatbot-header" aria-live="polite">
          What can I help you with?
        </div>
        <div className="chatbot-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message-container ${msg.sender}`}>
              {msg.sender === 'bot' && (
                <img
                  src="/images/bot-icon.png"
                  alt="Bot"
                  className="chat-icon bot-icon"
                />
              )}
              <div className={`message ${msg.sender}-message`}>{msg.text}</div>
              {msg.sender === 'user' && (
                <img
                  src="/images/user-icon.png"
                  alt="User"
                  className="chat-icon user-icon"
                />
              )}
            </div>
          ))}
          {loading && <div className="typing-indicator">...</div>}
          <div ref={messagesEndRef} /> {/* This helps us scroll to the last message */}
        </div>
        <div className="chatbot-input">
          <input
            type="text"
            value={userInput}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            aria-label="Type your message" // For screen readers
          />
          <button
            onClick={handleSendMessage}
            disabled={loading} // Disable while loading
            aria-label="Send message" // For screen readers
          >
            <img src="/images/send.png" alt="Send" />
          </button>
        </div>
      </div>
      <footer>
        <p>Contact us: support@pcosmanagement.com</p>
        <p>
          Legal Disclaimer: This information is for educational purposes and not
          a substitute for medical advice.
        </p>
      </footer>
    </div>
  );
};

export default Chatbot;
