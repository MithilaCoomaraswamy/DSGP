import React, { useState, useEffect } from 'react';

const Profile = () => {
  const [user, setUser] = useState(null);
  
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };
  

  useEffect(() => {
    // Retrieve user data from localStorage (or you could use a global state)
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
      setUser(userData);
    }
  }, []);

  return (
    <div className="profile-container">
      {user ? (
        <>
          <h2>Welcome, {user.name}</h2>
          <p>Email: {user.email}</p>
        </>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

export default Profile;
