// Footer.js
import React from 'react';

const Footer = () => (
  <footer className="footer">
    <div className="footer-container">
      <div>
        <h3>About Us</h3>
        <p>Learn more about our company and mission.</p>
      </div>
      <div>
        <h3>Contact Us</h3>
        <p>Email us at: <a href="mailto:fempredict@gmail.com" className="footer-link">fempredict@gmail.com</a></p>
      </div>
      <div>
        <h3>Privacy Policy</h3>
        <p><a href="/privacy-policy" className="footer-link">Read our privacy policy</a></p>
      </div>
      <div>
        <h3>Terms of Use</h3>
        <p><a href="/terms-of-use" className="footer-link">View terms of use</a></p>
      </div>
    </div>
    <div className="footer-bottom">
      <p>&copy; 2025 FemPredict. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;
