import React from 'react';
import './MenuIcon.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const MenuIcon = ({ icon, size, onClick }) => {
  return (
    <div className="menu-icon" onClick={onClick}>
      <FontAwesomeIcon icon={icon} size={size} />
    </div>
  );
};

export default MenuIcon;
