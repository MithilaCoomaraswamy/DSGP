import React, { useState } from 'react';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle the login logic here
    if (email === '' || password === '') {
      setError('Please fill out both fields');
    } else {
      setError('');
      console.log('Form submitted:', { email, password });
      // You can call your authentication function here
    }
  };

  return (
    <div className="login-container">
      {/* Left section (image) */}
      <div className="image-container">
        <img
          src="pic.png"
          alt="Image Placeholder"
          className="login-image"
        />
      </div>

      {/* Right section (form) */}
      <div className="login-form-container">
        <div className="login-form">
          {/* Logo at the top center */}
          <img
            src="icon.png"
            alt="Pinterest Logo"
            className="login-logo"
          />
          <h2>Welcome to FemPredict</h2>
          {error && <div className="error-message">{error}</div>}
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
              {/* Forgot your password link */}
              <div className="forgot-password-link">
                <a href="#">Forgot password?</a>
              </div>
            </div>
            <button type="submit" className="login-button">
              Log In
            </button>
          </form>

          {/* Disclaimer about terms and privacy */}
          <div className="terms-disclaimer">
            <p>
              By continuing, you agree to FemPredict's <a href="#">Terms of Service</a> and acknowledge that you've read our{' '}
              <a href="#">Privacy Policy</a>
            </p>
          </div>
          <div className="signup-link">
            <span>Don't have an account? </span>
            <a href="#">Sign up</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
