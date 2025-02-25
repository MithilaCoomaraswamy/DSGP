import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Importing useNavigate for navigation

const LoginForm = () => {
  // Separate state for each section
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupUsername, setSignupUsername] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showSignUp, setShowSignUp] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailForSent, setEmailForSent] = useState('');
  const [loading, setLoading] = useState(false);  // Added loading state for password reset

  const navigate = useNavigate(); // Initialize the useNavigate hook

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setError('');

    if (loginEmail === '' || loginPassword === '') {
      setError('Please fill out both fields');
    } else {
      setError('');
      console.log('Form submitted:', { loginEmail, loginPassword });
    }

    try {
      const response = await axios.post('http://localhost:5000/login', { email: loginEmail, password: loginPassword });
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
  
    if (signupUsername === '' || signupEmail === '' || signupPassword === '') {
      if (signupUsername === '') setError('Please enter a username');
      else if (signupEmail === '') setError('Please enter an email address');
      else if (signupPassword === '') setError('Please enter a password');
    } else {
      setError('');
      console.log('Sign Up Form submitted:', { signupUsername, signupEmail, signupPassword });
    }
  
    try {
      const response = await axios.post('http://localhost:5000/register', { username: signupUsername, email: signupEmail, password: signupPassword });
      if (response.status === 201) {
        setSuccessMessage('Sign Up successful!');
        console.log('Success:', response.data);
  
        // Save user data to localStorage (make sure you're using the correct response data)
        localStorage.setItem('user', JSON.stringify(response.data.user)); // Ensure you're saving the 'user' object
  
        // Navigate to profile page
        navigate('/profile');  // Redirect to profile page after successful sign-up
      }
    } catch (err) {
      setError(err.response && err.response.data ? err.response.data.message : 'Error during sign up');
      console.error('Error:', err.response ? err.response.data : err);
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);  // Start loading spinner
    setError('');
    setSuccessMessage('');

    if (forgotEmail === '') {
      setError('Please enter your email address');
    } else {
      setError('');
      console.log('Password reset email sent:', { forgotEmail });

      try {
        const response = await axios.post('http://localhost:5000/forgot-password', { email: forgotEmail });
        if (response.status === 200) {
          setSuccessMessage('Password reset email sent successfully');
          setEmailSent(true);
          setEmailForSent(forgotEmail);
          console.log('Success:', response.data);
        }
      } catch (err) {
        setError('Error sending password reset email');
        console.error('Error:', err.response ? err.response.data : err);
      }
    }

    setLoading(false);  // Stop loading spinner
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
    setForgotEmail('');
  };

  return (
    <div className="login-container">
      <div className="image-container">
        <img src="pic1 (3).png" alt="Image Placeholder" className="login-image" />
      </div>

      <div className="login-form-container">
        <div className="login-form">
          <img src="icon.png" alt="FemPredict Logo" className="login-logo" />
          <h2>Welcome to FemPredict</h2>
          {error && <div className="error-message">{error}</div>}

          {showSignUp ? (
            <div>
              <p>Managing PCOS starts here</p>
              <form onSubmit={handleSignUpSubmit}>
                <div className="form-group">
                  <label htmlFor="signup-username">Username</label>
                  <input
                    type="text"
                    id="signup-username"
                    placeholder="Username"
                    value={signupUsername}
                    onChange={(e) => setSignupUsername(e.target.value)}
                    className="login-input"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="signup-email">Email Address</label>
                  <input
                    type="email"
                    id="signup-email"
                    placeholder="Email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className="login-input"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="signup-password">Password</label>
                  <input
                    type="password"
                    id="signup-password"
                    placeholder="Password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
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
                      <label htmlFor="forgot-email">Email Address</label>
                      <input
                        type="email"
                        id="forgot-email"
                        placeholder="Enter your email to reset password"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        className="login-input"
                      />
                    </div>
                    <button type="submit" className="login-button">
                      {loading ? 'Sending...' : 'Reset Password'}
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
            <form onSubmit={handleLoginSubmit}>
              <div className="form-group">
                <label htmlFor="login-email">Email Address</label>
                <input
                  type="email"
                  id="login-email"
                  placeholder="Email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="login-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="login-password">Password</label>
                <input
                  type="password"
                  id="login-password"
                  placeholder="Password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
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
                <a href="/termsofservice" target="_blank">Terms of Service</a> and acknowledge that you've read our{' '}
                <a href="/privacypolicy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
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
