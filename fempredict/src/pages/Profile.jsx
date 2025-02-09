import React, { useState } from 'react';

const Profile = ({ closeModal }) => {
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and sign-up
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isLogin) {
      // Perform login logic here
      console.log('Logging in with', formData);
    } else {
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords don't match!");
        return;
      }
      // Perform sign-up logic here
      console.log('Signing up with', formData);
    }
  };

  return (
    <div className="profile-container">
      <div className="auth-container">
        <div className="right-side">
          <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
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

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              {/* Forgot Password link under the password field */}
              {isLogin && (
                <p className="forgot-password">
                  <a href="#">Forgot Password?</a>
                </p>
              )}
            </div>

            {!isLogin && (
              <div className="form-group">
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
            )}

            <button type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
          </form>

          <p>
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </div>

        {/* Close Modal Button (Cross Icon) */}
        <button className="close-modal" onClick={closeModal}>×</button>
      </div>
    </div>
  );
};

export default Profile;
