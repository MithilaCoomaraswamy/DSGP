function ContactUs() {
    return (
      <div className="contact-us">
        <h2>Contact Us</h2>
        
        <p>
          We’d love to hear from you! Whether you have questions, feedback, or need assistance, feel free to get in touch with us. Our team is here to help you.
        </p>
  
        <h3>Customer Support</h3>
        <p>If you have any questions regarding our products or services, please reach out to our support team:</p>
        <p>
          <strong>Email:</strong> <a href="mailto:support@yourcompany.com">support@yourcompany.com</a><br />
          <strong>Phone:</strong> (123) 456-7890<br />
          <strong>Business Hours:</strong> Monday – Friday, 9:00 AM – 5:00 PM (EST)
        </p>
  
        <h3>Sales Inquiries</h3>
        <p>If you are interested in our products or have any sales-related questions, please contact our sales department:</p>
        <p>
          <strong>Email:</strong> <a href="mailto:sales@yourcompany.com">sales@yourcompany.com</a><br />
          <strong>Phone:</strong> (123) 555-6789
        </p>
  
        <h3>Visit Us</h3>
        <p>If you would like to visit our office or meet with us in person, we’d be happy to set up an appointment. Please contact us to schedule a time.</p>
        <p>
          <strong>Office Address:</strong><br />
          [Your Company Name]<br />
          123 Business St.<br />
          City, State, ZIP
        </p>
  
        <h3>Social Media</h3>
        <p>Follow us on social media for the latest updates and news:</p>
        <ul>
          <li><a href="https://facebook.com/yourcompany" target="_blank" rel="noopener noreferrer">Facebook</a></li>
          <li><a href="https://twitter.com/yourcompany" target="_blank" rel="noopener noreferrer">Twitter</a></li>
          <li><a href="https://instagram.com/yourcompany" target="_blank" rel="noopener noreferrer">Instagram</a></li>
          <li><a href="https://linkedin.com/company/yourcompany" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
        </ul>
  
        <h3>Send Us a Message</h3>
        <p>If you prefer to contact us directly through this form, please fill out the information below and we’ll get back to you as soon as possible.</p>
  
        <form action="/submit-form" method="post">
          <label htmlFor="name">Your Name:</label><br />
          <input type="text" id="name" name="name" required /><br /><br />
  
          <label htmlFor="email">Your Email:</label><br />
          <input type="email" id="email" name="email" required /><br /><br />
  
          <label htmlFor="message">Your Message:</label><br />
          <textarea id="message" name="message" rows="4" required></textarea><br /><br />
  
          <button type="submit">Submit</button>
        </form>
      </div>
    );
  }
  
  export default ContactUs;
  