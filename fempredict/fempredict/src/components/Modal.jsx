import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import '../styles/Modal.css';
import ForgotPasswordModal from './ForgotPasswordModal'; // Import the Forgot Password modal

const Modal = ({ isOpen, onClose, onLogin, title }) => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '' });
  const [message, setMessage] = useState('');
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);

  const openForgotPasswordModal = (e) => {
    e.preventDefault();
    setIsForgotPasswordOpen(true);
    onClose(); // Close current modal
  };

  const closeForgotPasswordModal = () => setIsForgotPasswordOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const { email, password, confirmPassword } = formData;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email || !password) return 'Email and Password are required.';
    if (!emailPattern.test(email)) return 'Please enter a valid email.';
    if (password.length < 6) return 'Password must be at least 6 characters.';
    if (isSignUp && password !== confirmPassword) return 'Passwords do not match.';
    return '';
  };

  const navigate = useNavigate(); // Initialize navigation

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const validationMessage = validateForm();
    if (validationMessage) {
      setMessage(validationMessage);
      return;
    }
  
    const { email, password } = formData;
    const endpoint = isSignUp ? 'http://localhost:5000/register' : 'http://localhost:5000/login';
  
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log('User data:', data);
        setMessage(`${isSignUp ? 'Signed up' : 'Logged in'} successfully!`);

        // Store only the email in localStorage
        localStorage.setItem('email', data.user.email);  // Store the email

  
        if (!isSignUp) {
          onLogin(); // Trigger callback
          onClose(); // Close modal
          navigate("/profile"); // Redirect to NewsBlog
        } else {
          setIsSignUp(false);
        }
      } else {
        setMessage(`Error: ${data.message || 'An error occurred'}`);
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
      console.error('Error:', error);
    }
  };
  

  useEffect(() => {
    if (!isOpen) {
      // Reset form data when modal is closed or user logs out
      setFormData({ email: '', password: '', confirmPassword: '' });
      setMessage('');
    }
  }, [isOpen]); // Reset state when modal visibility changes

  return (
    <>
      {isOpen && !isForgotPasswordOpen && (
        <div className="modal-overlay" onClick={onClose}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <header className="modal-header">
              <h2>{isSignUp ? 'Sign Up' : 'Login'}</h2>
              <button className="close-btn" onClick={onClose} aria-label="Close">X</button>
            </header>
            <div className="modal-body">
              <form onSubmit={handleSubmit} className="form">
                <div className="input-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                {!isSignUp && (
                  <div className="forgot-password">
                    <a href="#" onClick={openForgotPasswordModal} className="forgot-password-link">
                      Forgot Password?
                    </a>
                  </div>
                )}

                {isSignUp && (
                  <>
                    <div className="input-group">
                      <label htmlFor="confirmPassword">Confirm Password</label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="terms-privacy">
                      <label>
                        <input type="checkbox" required />
                        I agree to the{' '}
                        <a href="/terms" target="_blank" rel="noopener noreferrer">terms and conditions</a> and{' '}
                        <a href="/privacy" target="_blank" rel="noopener noreferrer">privacy policy</a>.<br />
                      </label>
                    </div>
                  </>
                )}

                <button type="submit">{isSignUp ? 'Sign Up' : 'Login'}</button>
              </form>

              {message && <p className="message error">{message}</p>}

              <p className="toggle-text">
                {isSignUp ? (
                  <>
                    Already have an account?{' '}
                    <span onClick={() => setIsSignUp(false)} className="toggle-link">Login</span>
                  </>
                ) : (
                  <>
                    Don't have an account?{' '}
                    <span onClick={() => setIsSignUp(true)} className="toggle-link">Sign Up</span>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      <ForgotPasswordModal isOpen={isForgotPasswordOpen} onClose={closeForgotPasswordModal} />
    </>
  );
};

export default Modal;
