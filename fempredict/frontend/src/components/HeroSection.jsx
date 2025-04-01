import React, { useState } from 'react';
import '../styles/HeroSection.css'; 
import Button from './Button';
import Modal from './Modal'; 

const HeroSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); // Manage modal state

  const handleButtonClick = () => {
    setIsModalOpen(true); // Show the modal when the button is clicked
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal when the close button is clicked
  };

  return (
    <section className="hero-section">
      <div className="hero-content">
        <h1>Empowering Women with PCOS Management</h1>
        <p>
          Take control of your health with personalized guidance, resources, and expert advice for managing PCOS.
        </p>
        {/* The button triggers the modal */}
        <Button label="Get Started" className="primary-btn" onClick={handleButtonClick} />
      </div>

      {/* Modal component */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Sign Up">
        {/* The modal content will go here if you want to pass something */}
        {/* You can have your form, content, or anything else as per your modal design */}
      </Modal>
    </section>
  );
};

export default HeroSection;
