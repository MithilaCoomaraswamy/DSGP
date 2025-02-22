import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Importing useNavigate for navigation

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showSignUp, setShowSignUp] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailForSent, setEmailForSent] = useState('');

  const navigate = useNavigate();  // Initialize the useNavigate hook

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setError('');

    if (email === '' || password === '') {
      setError('Please fill out both fields');
    } else {
      setError('');
      console.log('Form submitted:', { email, password });
    }

    try {
      const response = await axios.post('http://localhost:5000/login', { email, password });
      if (response.status === 200) {
        setSuccessMessage('Login successful!');
        console.log('Success:', response.data);
        
        // Save user data to localStorage
        localStorage.setItem('user', JSON.stringify(response.data)); // assuming response.data contains user info
  
        // After successful login, navigate to the profile page
        navigate('/profile');
      }
    } catch (err) {
      setError('Invalid credentials');
      console.error('Error:', err.response ? err.response.data : err);
    }
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setError('');

    if (name === '' || email === '' || password === '') {
      setError('Please fill out all fields');
    } else {
      setError('');
      console.log('Sign Up Form submitted:', { name, email, password });
    }

    try {
      const response = await axios.post('http://localhost:5000/signup', { name, email, password });
      if (response.status === 200) {
        setSuccessMessage('Sign Up successful!');
        console.log('Success:', response.data);
      }
    } catch (err) {
      setError('Error during sign up');
      console.error('Error:', err.response ? err.response.data : err);
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (email === '') {
      setError('Please enter your email address');
    } else {
      setError('');
      console.log('Password reset email sent:', { email });

      try {
        const response = await axios.post('http://localhost:5000/forgot-password', { email });
        if (response.status === 200) {
          setSuccessMessage('Password reset email sent successfully');
          setEmailSent(true);
          setEmailForSent(email);
          console.log('Success:', response.data);
        }
      } catch (err) {
        setError('Error sending password reset email');
        console.error('Error:', err.response ? err.response.data : err);
      }
    }
  };

  const handleSignUpClick = () => {
    setShowSignUp(true);
    setShowForgotPassword(false);
  };

  const handleForgotPasswordClick = () => {
    setShowForgotPassword(true);
    setShowSignUp(false);
  };

  const handleBackToLogin = () => {
    setShowSignUp(false);
    setShowForgotPassword(false);
  };

  const handleTryAgain = () => {
    setEmailSent(false);
    setEmail('');
  };

  return (
    <div className="login-container">
      <div className="image-container">
        <img src="pic.png" alt="Image Placeholder" className="login-image" />
      </div>

      <div className="login-form-container">
        <div className="login-form">
          <img src="icon.png" alt="Pinterest Logo" className="login-logo" />
          <h2>Welcome to FemPredict</h2>
          {error && <div className="error-message">{error}</div>}

          {showSignUp ? (
            <div>
              <p>Managing PCOS starts here</p>
              <form onSubmit={handleSignUpSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="login-input"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="login-input"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="login-input"
                  />
                </div>
                <button type="submit" className="login-button">
                  Sign Up
                </button>
              </form>
            </div>
          ) : showForgotPassword ? (
            <div>
              {emailSent ? (
                <div>
                  <h3>Email Sent</h3>
                  <p>We sent an email to {emailForSent}. If this email is connected to a FemPredict account, you'll be able to reset your password.</p>
                  <p>Didn't get the email? Try these tips from our <a href="#" target="_blank">Help Centre</a>.</p>
                  <button onClick={handleTryAgain} className="login-button">Try Again</button>
                  <div className="back-to-login">
                    <span>Back to Login</span>
                    <button onClick={handleBackToLogin} className="login-button">Back to Login</button>
                  </div>
                </div>
              ) : (
                <div>
                  <p>Reset your password</p>
                  <form onSubmit={handleForgotPasswordSubmit}>
                    <div className="form-group">
                      <label htmlFor="email">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        placeholder="Enter your email to reset password"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="login-input"
                      />
                    </div>
                    <button type="submit" className="login-button">
                      Reset Password
                    </button>
                  </form>
                  {successMessage && <div className="success-message">{successMessage}</div>}
                  <div className="back-to-login">
                    <a href="#" onClick={handleBackToLogin}>Back</a>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="login-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="login-input"
                />
                <div className="forgot-password-link">
                  <a href="#" onClick={handleForgotPasswordClick}>Forgot password?</a>
                </div>
              </div>
              <button type="submit" className="login-button">
                Log In
              </button>
            </form>
          )}

          {/* Only show the disclaimer if the user is not on the Forgot Password screen */}
          {!showForgotPassword && (
            <div className="terms-disclaimer">
              <p>
                By continuing, you agree to FemPredict's{' '}
                <a href="TermsofService" target="_blank">Terms of Service</a> and acknowledge that you've read our{' '}
                <a href="PrivacyPolicy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
              </p>
            </div>
          )}

          {showSignUp && (
            <div className="back-to-login">
              <span>Already have an account? </span>
              <a href="#" onClick={handleBackToLogin}>Login</a>
            </div>
          )}

          {!showSignUp && !showForgotPassword && (
            <div className="signup-link">
              <span>Don't have an account? </span>
              <a href="#" onClick={handleSignUpClick}>Sign up</a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
