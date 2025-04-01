import React from 'react';
import '../styles/Button.css'; 

const Button = ({ label, onClick, className, type = 'button' }) => {
  return (
    <button className={`btn ${className}`} onClick={onClick} type={type}>
      {label}
    </button>
  );
};

export default Button;
