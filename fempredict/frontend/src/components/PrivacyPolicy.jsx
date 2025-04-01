import React from 'react';
import '../styles/PrivacyPolicy.css'; // Import the CSS for styling

const PrivacyPolicy = () => {
  return (
    <div className="privacy-container">
      <h1>Privacy Policy</h1>
      <p>Effective Date: March 22, 2025</p>

      <h2>1. Introduction</h2>
      <p>
        FemPredict values your privacy and is committed to protecting your personal
        information. This Privacy Policy explains how we collect, use, and share your
        personal information when you use our website or mobile application (the “Service”).
      </p>

      <h2>2. Information We Collect</h2>
      <p>
        We may collect the following types of personal information when you use our Service:
      </p>
      <ul>
        <li>Personal Identification Information: Name, email address, etc.</li>
        <li>Health-Related Information: Data about your menstrual cycle, health conditions, etc.</li>
        <li>Usage Data: Information about how you use our Service, including your interactions with features and content.</li>
      </ul>

      <h2>3. How We Use Your Information</h2>
      <p>
        We use your information to provide, improve, and personalize the Service. This includes:
      </p>
      <ul>
        <li>Providing health-related recommendations and tools, such as PCOS risk calculators and period trackers.</li>
        <li>Sending you newsletters, updates, and notifications related to your health or the Service.</li>
        <li>Analyzing user behavior to enhance the Service’s features and user experience.</li>
      </ul>

      <h2>4. Data Sharing</h2>
      <p>
        We do not share your personal information with third parties, except in the following cases:
      </p>
      <ul>
        <li>With your consent or as required to provide the Service (e.g., sharing data with healthcare providers or trusted partners).</li>
        <li>To comply with legal obligations, enforce our Terms of Service, or protect our rights and safety.</li>
        <li>With service providers who assist us in operating the Service (e.g., cloud hosting providers). These third parties are contractually obligated to protect your data.</li>
      </ul>

      <h2>5. Data Security</h2>
      <p>
        We implement industry-standard security measures to protect your personal information from unauthorized access, alteration, or destruction. However, no method of transmission over the internet is completely secure, and we cannot guarantee absolute security.
      </p>

      <h2>6. Your Rights</h2>
      <p>
        You have the right to:
      </p>
      <ul>
        <li>Access, update, or delete your personal information.</li>
        <li>Opt-out of receiving marketing communications.</li>
        <li>Request a copy of the data we have on file for you.</li>
      </ul>
      <p>
        To exercise these rights, please contact us at <a href="mailto:contact@fempredict.com">contact@fempredict.com</a>.
      </p>

      <h2>7. Cookies</h2>
      <p>
        Our website may use cookies to enhance your experience. Cookies are small text files stored on your device that help us analyze website traffic and improve the functionality of our Service. You can set your browser to refuse cookies or alert you when cookies are being sent.
      </p>

      <h2>8. Changes to This Privacy Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. When we do, we will post the updated policy on this page with a new effective date. We encourage you to review this page periodically to stay informed about how we protect your personal information.
      </p>

      <h2>9. Contact Us</h2>
      <p>
        If you have any questions or concerns about this Privacy Policy, please contact us at: <a href="mailto:contact@fempredict.com">contact@fempredict.com</a>
      </p>
    </div>
  );
};

export default PrivacyPolicy;
