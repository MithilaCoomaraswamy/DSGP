import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div>
          <h3>About Us</h3>
          <p><a href="/about" target="_blank" className="footer-link">Learn more about our company and mission.</a></p>
        </div>
        <div>
          <h3>Contact Us</h3>
          <p>Email us at: <a href="mailto:fempredict@gmail.com" target="_blank" className="footer-link">fempredict@gmail.com</a></p>
        </div>
        <div>
          <h3>Privacy Policy</h3>
          <p><a href="/privacypolicy" target="_blank" className="footer-link">Read our privacy policy</a></p>
        </div>
        <div>
          <h3>Terms of Use</h3>
          <p><a href="/termsofservice" target="_blank" className="footer-link">View terms of use</a></p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} FemPredict. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
