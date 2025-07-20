import React from 'react';
import './Button.css';

const Button = ({ children, onClick, type = 'button', variant = 'primary', disabled = false, fullWidth = false }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`btn btn-${variant} ${fullWidth ? 'btn-full-width' : ''}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
