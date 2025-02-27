import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './pages/LoginForm.jsx';  // Import your LoginForm component
import Profile from './pages/Profile.jsx';      // Import your Profile component
import TermsOfService from './pages/TermsofService.jsx';
import PrivacyPolicy from './pages/PrivacyPolicy.jsx';
import Tracker from './pages/Tracker.jsx';
import Recommender from './pages/Recommender.jsx';
import PCOS from './pages/PCOS.jsx';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/termsofservice" element={<TermsOfService />} />
        <Route path="/privacypolicy" element={<PrivacyPolicy />} />
        <Route path="/period-tracker" element={<Tracker />} />
        <Route path="/exercise-recommender" element={<Recommender />} />
        <Route path="/pcos-quiz" element={<PCOS />} />
      </Routes>
    </Router>
  );
};

export default App;
