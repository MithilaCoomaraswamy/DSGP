import React, { useState } from 'react';
import './profile.css';

const Profile = () => {
  const [user, setUser] = useState({
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    periodStart: '2025-02-10', // example date format
    periodEnd: '2025-02-15', // example date format
    cycleLength: 28, // average cycle length in days
    periodLength: 5, // length of period in days
    history: [
      { cycleStart: '2025-01-10', cycleEnd: '2025-01-15' },
      { cycleStart: '2025-02-10', cycleEnd: '2025-02-15' }
    ]
  });

  const calculateNextPeriod = () => {
    const lastPeriodDate = new Date(user.periodEnd);
    const nextPeriodDate = new Date(lastPeriodDate.setDate(lastPeriodDate.getDate() + user.cycleLength));
    return nextPeriodDate.toLocaleDateString();
  };

  return (
    <div className="profile-dashboard">
      <div className="profile-header">
        <h2>Profile Dashboard</h2>
        <p>Welcome back, {user.name}!</p>
      </div>

      <div className="profile-info">
        <h3>Profile Information</h3>
        <ul>
          <li><strong>Name:</strong> {user.name}</li>
          <li><strong>Email:</strong> {user.email}</li>
        </ul>
      </div>

      <div className="period-info">
        <h3>Current Period</h3>
        <p><strong>Period Start:</strong> {user.periodStart}</p>
        <p><strong>Period End:</strong> {user.periodEnd}</p>
        <p><strong>Cycle Length:</strong> {user.cycleLength} days</p>
        <p><strong>Period Length:</strong> {user.periodLength} days</p>
      </div>

      <div className="next-period">
        <h3>Next Period</h3>
        <p><strong>Next Expected Period Start:</strong> {calculateNextPeriod()}</p>
      </div>

      <div className="cycle-history">
        <h3>Cycle History</h3>
        <ul>
          {user.history.map((entry, index) => (
            <li key={index}>
              <strong>Cycle {index + 1}:</strong> {entry.cycleStart} to {entry.cycleEnd}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Profile;
