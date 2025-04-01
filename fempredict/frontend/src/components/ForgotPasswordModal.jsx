import React, { useState } from 'react';
import '../styles/Modal.css';

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Handle form data change
  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailPattern.test(email)) {
      setMessage('Please enter a valid email.');
      setIsSubmitting(false);
      return;
    }

    try {
      // Simulate sending a password reset request (replace with your API request)
      const response = await fetch('http://localhost:5000/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('A password reset link has been sent to your email!');

        // Here we will simulate waiting for the user to click the reset link
        // After they click it, we consider them logged in

        // Simulate the user clicking the reset link (this would be triggered after the real reset process)
        setTimeout(() => {
          // Store user details in localStorage (simulate successful login)
          const user = { email }; // Add any additional user details if needed
          localStorage.setItem('user', JSON.stringify(user)); // Store user details

          // Close the modal
          onClose();

          // Show alert for successful login
          alert('You have successfully logged in!');
        }, 3000); // Simulate the 3-second delay after clicking the reset link
      } else {
        setMessage(`Error: ${data.message}`);
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <h2>Forgot Password</h2>
          <button className="close-btn" onClick={onClose}>X</button>
        </header>
        <div className="modal-body">
          <form onSubmit={handleSubmit} className="form">
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          {message && <p className="message">{message}</p>} {/* Display message */}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
