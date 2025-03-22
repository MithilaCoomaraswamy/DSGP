import React, { useState } from 'react';
import '../styles/Modal.css';

const Modal = ({ isOpen, onClose, title }) => {
  const [isSignUp, setIsSignUp] = useState(true);  // State to toggle between Sign Up and Login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  // Function to toggle between Sign Up and Login
  const toggleForm = () => {
    setIsSignUp(!isSignUp);
    setMessage(''); // Clear any previous messages when switching forms
  };

  // Handle form submission (Sign up or Login)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!email || !password) {
      setMessage('Email and Password are required.');
      return;
    }

    // Email format validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setMessage('Please enter a valid email.');
      return;
    }

    // Password validation (at least 6 characters)
    if (password.length < 6) {
      setMessage('Password must be at least 6 characters.');
      return;
    }

    // Confirm password validation (only for sign-up)
    if (isSignUp && password !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    const formData = { email, password, confirmPassword };

    try {
      // Determine endpoint based on the form type (Sign Up or Login)
      const endpoint = isSignUp ? 'http://localhost:5000/api/signup' : 'http://localhost:5000/api/login';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage(`${isSignUp ? 'Signed up' : 'Logged in'} successfully!`);
        
        if (!isSignUp) {
          localStorage.setItem('authToken', data.token); // Store the token in local storage
          // Close modal after successful login
          onClose();
        } else {
          // Auto-login after successful sign-up, switch to login form
          setIsSignUp(false); // Switch to Login form
        }
      } else {
        setMessage(`Error: ${data.message}`);
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
      console.error('Error:', error);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <h2>{title}</h2>
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
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {isSignUp && (
              <>
                <div className="input-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                {/* Add terms and conditions and privacy policy agreement */}
                <div className="terms-privacy">
                  <label>
                    <input type="checkbox" required />
                    I agree to the{' '}
                    <a href="/terms" target="_blank" rel="noopener noreferrer">
                      terms and conditions
                    </a>{' '}
                    and{' '}
                    <a href="/privacy" target="_blank" rel="noopener noreferrer">
                      privacy policy
                    </a>.
                  </label>
                </div>
              </>
            )}

            <button type="submit">{isSignUp ? 'Sign Up' : 'Login'}</button>
          </form>

          {message && <p className="message error">{message}</p>} {/* Display the error or success message */}

          <p className="toggle-text">
            {isSignUp ? (
              <>
                Already have an account?{' '}
                <span onClick={toggleForm} className="toggle-link">Login</span>
              </>
            ) : (
              <>
                Don't have an account?{' '}
                <span onClick={toggleForm} className="toggle-link">Sign Up</span>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Modal;
