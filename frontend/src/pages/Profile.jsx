import React, { useState } from 'react';

const Profile = ({ closeModal }) => {
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and sign-up
  const [formData, setFormData] = useState({
    username: '',
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLogin) {
      // Perform login logic here
      console.log('Logging in with', formData);
    } else {
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords don't match!");
        return;
      }

      // Send data to the backend (Flask API)
      try {
        const response = await fetch('http://localhost:5000/register', {  // Replace with your backend URL
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: formData.username,
            email: formData.email,
            password: formData.password,
          }),
        });

        const data = await response.json();

        if (response.status === 201) {
          alert('User registered successfully!');
          console.log(data);
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred, please try again.');
      }
    }
  };

  return (
    <div className="profile-container">
      <div className="auth-container">
        <div className="right-side">
          <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
          <p>Welcome to FemPredict</p>
          <form onSubmit={handleSubmit}>
            {/* Username input field only visible during sign-up */}
            {!isLogin && (
              <div className="form-group">
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  placeholder="Username"
                />
              </div>
            )}

            <div className="form-group">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Email"
              />
            </div>

            <div className="form-group">
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Password"
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
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Confirm Password"
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
