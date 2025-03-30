import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header'; // Import Header component
import Footer from './components/Footer'; // Import Footer component
import Home from './components/Home'; // Import Home page
import PeriodTracker from './components/PeriodTracker'; // Period Tracker page
import PCOSRiskCalculator from './components/PCOSRiskCalculator'; // PCOS Risk Calculator page
import ExerciseRecommender from './components/ExerciseRecommender'; // Exercise Recommender page
import Chatbot from './components/Chatbot'; // Chatbot page
import Profile from './components/Profile'; // Profile page
import About from './components/About'; // About page
import Contact from './components/Contact'; // Contact page
import TermsOfService from './components/TermsOfService'; // Terms of Service page
import PrivacyPolicy from './components/PrivacyPolicy'; // Privacy Policy page
import './App.css';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <>
      <Header/>

      <div className="app-content">
        <Routes>
          {/* Define routes for all pages */}
          <Route path="/" element={<Home />} /> {/* Home page */}
          <Route path="/pcos-risk-calculator" element={<PCOSRiskCalculator />} />
          <Route path="/period-tracker" element={<PeriodTracker />} />
          <Route path="/exercise-recommender" element={<ExerciseRecommender />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/profile" element={<Profile setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
        </Routes>
      </div>

      {/* Footer component */}
      <Footer />
    </>
  );
};

export default App;
