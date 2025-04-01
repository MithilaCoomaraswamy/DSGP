import React, { useState } from 'react';
import '../styles/CallToAction.css';
import Button from './Button';
import Modal from './Modal'; 

const CallToAction = () => {

  const [isModalOpen, setIsModalOpen] = useState(false); // Manage modal state

  const handleButtonClick = () => {
    setIsModalOpen(true); // Show the modal when the button is clicked
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal when the close button is clicked
  };

  return (
    <section className="cta-section">
      <h2>Start Your Journey Today</h2>
      <p>
        Ready to take control of your PCOS health? Sign up now to get started with personalized plans and expert guidance.
      </p>
      <Button label="Sign Up Now" className="cta-btn" onClick={handleButtonClick}/>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Sign Up">
      </Modal>
    </section>
  );
};

export default CallToAction;
