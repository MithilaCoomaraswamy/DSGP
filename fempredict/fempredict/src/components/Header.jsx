import React from 'react';
import { Link } from "react-router-dom";
import '../styles/Header.css'; 

const Header = () => {
  return (
    <header className="header">
      <nav>
        <ul>
          <li>
            <Link to="/" className="logo">
              FemPredict
            </Link>
          </li>
          <li>
            <Link to="/pcos-risk-calculator">
              PCOS Risk Calculator
            </Link>
          </li>
          <li>
            <Link to="/period-tracker">
              Period Tracker
            </Link>
          </li>
          <li>
            <Link to="/exercise-recommender">
              Exercise Recommender
            </Link>
          </li>
          <li>
            <Link to="/chatbot">
              Chatbot
            </Link>
          </li>
          <li>
            <Link to="/">
              <img src="/images/menu.png" alt="Send" />
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;






