import React from 'react';
import './Slot.css';

const Slot = ({ value, receivable, onClick }) => {
  return (
    <div
      className={`Slot ${value ? 'filled' : ''} ${
        receivable ? 'receivable' : ''
      } ${!receivable && !value ? 'non-receivable' : ''}`}
      onClick={!value ? onClick : null}
    >
      {value || ''}
    </div>
  );
};

export default Slot;
