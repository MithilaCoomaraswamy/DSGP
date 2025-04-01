import React from 'react';
import '../styles/Testimonials.css';

const Testimonials = () => {
  return (
    <section className="testimonials-section">
      <h2>What Women Are Saying</h2>
      <div className="testimonial-item">
        <p className="testimonial-quote">"This website has completely transformed my PCOS journey. I feel empowered and supported."</p>
        <p className="testimonial-author">- Sarah, 28</p>
      </div>
      <div className="testimonial-item">
        <p className="testimonial-quote">"The personalized advice and information made all the difference. I am finally feeling balanced."</p>
        <p className="testimonial-author">- Emily, 32</p>
      </div>
      <div className="testimonial-item">
        <p className="testimonial-quote">"I’ve never felt so in control of my health. The resources here are invaluable."</p>
        <p className="testimonial-author">- Jessica, 34</p>
      </div>
    </section>
  );
};

export default Testimonials;
