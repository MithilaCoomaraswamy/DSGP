import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Links */}
        <div className="footer-links">
          <ul>
            <li><a href="/">About</a></li>
            <li><a href="/">Privacy</a></li>
            <li><a href="/">Terms</a></li>
            <li><a href="/">Contact</a></li>
          </ul>
        </div>
        
        {/* Copyright */}
        <div className="footer-copyright">
          <p>&copy; {new Date().getFullYear()} FemPredict. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
