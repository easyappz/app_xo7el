import React from 'react';
import './Input.css';

const Input = ({ type = 'text', value, onChange, placeholder, name, required = false, label }) => {
  return (
    <div className="input-group">
      {label && <label htmlFor={name}>{label}</label>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        name={name}
        id={name}
        required={required}
        className="input-field"
      />
    </div>
  );
};

export default Input;
