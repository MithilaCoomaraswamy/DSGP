import React from 'react';
import '../styles/Input.css';

const Input = ({ type, label, value, onChange, placeholder }) => {
  return (
    <div className="input-group">
      <label>{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="input-field"
      />
    </div>
  );
};

export default Input;
