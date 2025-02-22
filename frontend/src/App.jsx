import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './pages/LoginForm';
import PrivacyPolicy from './pages/PrivacyPolicy.jsx'; // Import PrivacyPolicy component

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} /> {/* Login page route */}
        <Route path="/privacy-policy" element={<PrivacyPolicy />} /> {/* Privacy Policy page route */}
      </Routes>
    </Router>
  );
};

export default App;

