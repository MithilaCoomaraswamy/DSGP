import React, { useState } from 'react';
import '../styles/Contact.css'; // Import CSS for styling

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Normally here you would send the form data to your server.
    console.log('Form Submitted:', formData);
  };

  return (
    <div className="contact-container">
      <h1>Contact Us</h1>
      <p>If you have any questions or feedback, feel free to reach out to us!</p>

      <form onSubmit={handleSubmit} className="contact-form">
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows="4"
            required
          ></textarea>
        </div>

        <button type="submit" className="submit-btn">Send Message</button>
      </form>
    </div>
  );
};

export default Contact;
