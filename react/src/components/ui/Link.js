import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import './Link.css';

const Link = ({ to, children }) => {
  return (
    <RouterLink to={to} className="custom-link">
      {children}
    </RouterLink>
  );
};

export default Link;
