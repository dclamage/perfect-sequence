import React, { useState } from 'react';
import './SequenceGenerator.css';
import { encodeSequence } from '../sequenceUtil';

const SequenceGenerator = ({ onClose }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const sequence = inputValue.split(',').map(Number);
    const encodedSequence = encodeSequence(sequence);
    const url = `${window.location.origin}?seq=${encodedSequence}`;
    window.open(url, '_blank'); // This line will open the URL in a new tab
  };

  return (
    <div className="sequence-generator-overlay">
      <div className="sequence-generator-dialog">
        <div className="sequence-generator-header">
          <h3>Sequence Generator</h3>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} className="sequence-generator-form">
          <label htmlFor="sequence-input">
            Enter sequence (comma-separated):
          </label>
          <input
            id="sequence-input"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button type="submit">Generate URL</button>
        </form>
      </div>
    </div>
  );
};

export default SequenceGenerator;
