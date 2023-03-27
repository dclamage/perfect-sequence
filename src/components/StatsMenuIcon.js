import React from 'react';
import './StatsMenuIcon.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBarChart } from '@fortawesome/free-solid-svg-icons';

const StatsMenuIcon = ({ onClick }) => {
  return (
    <div className="stats-menu-icon" onClick={onClick}>
      <FontAwesomeIcon icon={faBarChart} size="2x" />
    </div>
  );
};

export default StatsMenuIcon;
