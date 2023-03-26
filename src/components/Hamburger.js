import React from 'react';
import './Hamburger.css';

const Hamburger = ({ onClick }) => {
  return (
    <div className="hamburger" onClick={onClick}>
      <div className="bar" />
      <div className="bar" />
      <div className="bar" />
    </div>
  );
};

export default Hamburger;
