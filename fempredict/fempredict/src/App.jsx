import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';  // Import Header component
import PeriodTracker from './components/PeriodTracker';  // Your Period Tracker page
import PCOSRiskCalculator from './components/PCOSRiskCalculator';  // PCOS Risk Calculator page
import ExerciseRecommender from './components/ExerciseRecommender';  // Exercise Recommender page
import Chatbot from './components/Chatbot';  // Chatbot page
import Footer from './components/Footer';  // Import Footer component
import Home from './components/Home';  // Import Home page
import Profile from './components/Profile';  // Import Profile page
import About from './components/About';  // Import About page
import Contact from './components/Contact';  // Import Contact page
import TermsOfService from './components/TermsOfService';  // Import Terms of Service page
import PrivacyPolicy from './components/PrivacyPolicy';  // Import Privacy Policy page
import './App.css';

const App = () => {
  return (
    <>
      <Header /> {/* This will render the navigation bar */}
      <div className="app-content">
        <Routes>
          {/* Define all your routes */}
          <Route exact path="/" element={<Home />} /> {/* Home page */}
          <Route path="/pcos-risk-calculator" element={<PCOSRiskCalculator />} />
          <Route path="/period-tracker" element={<PeriodTracker />} />
          <Route path="/exercise-recommender" element={<ExerciseRecommender />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
};

export default App;
