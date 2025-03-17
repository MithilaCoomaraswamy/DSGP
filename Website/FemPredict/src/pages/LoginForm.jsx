import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const LoginForm = () => {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showSignUp, setShowSignUp] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailForSent, setEmailForSent] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationError, setVerificationError] = useState('');
  const [codeVerified, setCodeVerified] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordResetSuccess, setPasswordResetSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendCodeLoading, setResendCodeLoading] = useState(false);

  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setError('');
    if (loginEmail === '' || loginPassword === '') {
      setError('Please fill out both fields');
    } else {
      setError('');
      try {
        const response = await axios.post('http://localhost:5000/login', { email: loginEmail, password: loginPassword });
        if (response.status === 200) {
          setSuccessMessage('Login successful!');
          localStorage.setItem('user', JSON.stringify(response.data));
          navigate('/profile');
        }
      } catch (err) {
        setError('Invalid credentials');
      }
    }
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setError('');
    if (signupPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (signupEmail === '' || signupPassword === '') {
      setError('Please fill out all fields');
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/register', { email: signupEmail, password: signupPassword });
      if (response.status === 201) {
        setSuccessMessage('Sign Up successful!');
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate('/profile');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error during sign up');
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');
    if (forgotEmail === '') {
      setError('Please enter your email address');
    } else {
      try {
        const response = await axios.post('http://localhost:5000/forgot-password', { email: forgotEmail });
        if (response.status === 200) {
          setSuccessMessage('Verification code sent. Please check your email.');
          setEmailSent(true);
          setEmailForSent(forgotEmail);
        }
      } catch (err) {
        setError('Error sending verification email');
      }
    }
    setLoading(false);
  };

  const handleVerifyCodeSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/verify-code', { email: emailForSent, code: verificationCode });
      if (response.status === 200) {
        setCodeVerified(true);
        setVerificationError('');
      }
    } catch (err) {
      setVerificationError('Invalid or expired verification code');
    }
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      setVerificationError('Passwords do not match');
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/reset-password', {
        email: emailForSent,
        new_password: newPassword,
      });
      if (response.status === 200) {
        const loginResponse = await axios.post('http://localhost:5000/login', {
          email: emailForSent,
          password: newPassword,
        });
        if (loginResponse.status === 200) {
          localStorage.setItem('user', JSON.stringify(loginResponse.data));
          setPasswordResetSuccess(true);
          setVerificationError('');
          setCodeVerified(false);
          setTimeout(() => {
            setShowForgotPassword(false);
            setShowSignUp(false);
          }, 0); 
        }
      }
    } catch (err) {
      setVerificationError('Error resetting password');
    }
  };

  const handleSignUpClick = () => {
    setShowSignUp(true);
    setShowForgotPassword(false);
    setError('');
  };

  const handleForgotPasswordClick = () => {
    setShowForgotPassword(true);
    setShowSignUp(false);
    setError('');
  };

  const handleBackToLogin = () => {
    setShowSignUp(false);
    setShowForgotPassword(false);
    setError('');
  };

  const handleTryAgain = () => {
    setEmailSent(false);
    setForgotEmail('');
  };

  const handleResendCode = async () => {
    setResendCodeLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/forgot-password', { email: emailForSent });
      if (response.status === 200) {
        setSuccessMessage('Verification code resent. Please check your email.');
        setEmailSent(true);
      }
    } catch (err) {
      setError('Error resending verification code');
    }
    setResendCodeLoading(false);
  };

  return (
    <div>
      <div className="login-container">
        <div className="image-container">
          <img src="pic1 (3).png" alt="Image Placeholder" className="login-image" />
        </div>

        <div className="login-form-container">
          <div className="login-form">
            <img src="icon.png" alt="FemPredict Logo" className="login-logo" />
            <h2>Welcome to FemPredict</h2>

            {error && <div className="error-message">{error}</div>}

            <div className="state-message">
              {passwordResetSuccess && (
                <p>Your password has been reset successfully! You can now log in with your new password.</p>
              )}
            </div>

            {showSignUp ? (
              <div>
                <p>Managing PCOS starts here</p>
                <form onSubmit={handleSignUpSubmit}>
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
                  <div className="form-group">
                    <label htmlFor="confirm-password">Confirm Password</label>
                    <input
                      type="password"
                      id="confirm-password"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
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
                {!emailSent && (
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

                {emailSent && !codeVerified && !passwordResetSuccess && (
                  <div>
                    <h3>Enter the 6-digit verification code</h3>
                    <form onSubmit={handleVerifyCodeSubmit}>
                      <div className="form-group">
                        <label htmlFor="verification-code">Verification Code</label>
                        <input
                          type="text"
                          id="verification-code"
                          placeholder="Enter 6-digit code"
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value)}
                          className="login-input"
                        />
                      </div>
                      <button type="submit" className="login-button">
                        Verify Code
                      </button>
                    </form>
                    {verificationError && <div className="error-message">{verificationError}</div>}
                    <div className="resend-code-link">
                      <a href="#" onClick={handleResendCode}>
                        {resendCodeLoading ? 'Resending...' : 'Resend Code'}
                      </a>
                    </div>
                  </div>
                )}

                {codeVerified && (
                  <div>
                    <h3>Reset Your Password</h3>
                    <form onSubmit={handleResetPasswordSubmit}>
                      <div className="form-group">
                        <label htmlFor="new-password">New Password</label>
                        <input
                          type="password"
                          id="new-password"
                          placeholder="Enter new password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="login-input"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="confirm-new-password">Confirm New Password</label>
                        <input
                          type="password"
                          id="confirm-new-password"
                          placeholder="Confirm new password"
                          value={confirmNewPassword}
                          onChange={(e) => setConfirmNewPassword(e.target.value)}
                          className="login-input"
                        />
                      </div>
                      <button type="submit" className="login-button">
                        Reset Password
                      </button>
                    </form>
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
                  Login
                </button>
              </form>
            )}

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
              <div className="back-to-login">
                <span>Don't have an account? </span>
                <a href="#" onClick={handleSignUpClick}>Sign up</a>
              </div>
            )}
          </div>
        </div>
      </div>
      <footer className="footer">
      <div className="footer-container">
        <div>
          <h3>About Us</h3>
          <p><a href="/about" target="_blank" className="footer-link">Learn more about our company and mission.</a></p>
        </div>
        <div>
          <h3>Contact Us</h3>
          <p>Email us at: <a href="mailto:fempredict@gmail.com" target="_blank" className="footer-link">fempredict@gmail.com</a></p>
        </div>
        <div>
          <h3>Privacy Policy</h3>
          <p><a href="/privacypolicy" target="_blank" className="footer-link">Read our privacy policy</a></p>
        </div>
        <div>
          <h3>Terms of Use</h3>
          <p><a href="/termsofservice" target="_blank" className="footer-link">View terms of use</a></p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} FemPredict. All Rights Reserved.</p>
      </div>
    </footer>
    </div>
  );
};

export default LoginForm;
