import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for routing
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <ul>
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/contact">Contact</Link>
        </li>
        <li>
          <Link to="/terms">Terms of Use</Link>
        </li>
        <li>
          <Link to="/privacy">Privacy Policy</Link>
        </li>
      </ul>
      <p>&copy; {new Date().getFullYear()} FemPredict. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
