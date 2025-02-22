import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './pages/LoginForm.jsx';  // Import your LoginForm component
import Profile from './pages/Profile.jsx';      // Import your Profile component
import TermsOfService from './pages/TermsofService.jsx';
import PrivacyPolicy from './pages/PrivacyPolicy.jsx';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/termsofservice" element={<TermsOfService />} />
        <Route path="/privacypolicy" element={<PrivacyPolicy />} />
      </Routes>
    </Router>
  );
};

export default App;
