import React, { useState } from 'react';
import './home.css';

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
      <div className="login-form">
        <h2>Log in</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
          />
          <button type="submit" className="login-button">
            Log In
          </button>
        </form>
        <div className="signup-link">
          <span>Don't have an account? </span>
          <a href="#">Sign up</a>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
