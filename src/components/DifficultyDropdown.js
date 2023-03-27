import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSlidersH } from '@fortawesome/free-solid-svg-icons';
import './DifficultyDropdown.css';

const DifficultyDropdown = ({
  difficultyInfo,
  currentDifficulty,
  onDifficultyChange,
}) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDifficultyClick = (event, numSlots) => {
    event.stopPropagation();
    onDifficultyChange(numSlots);
    setDropdownVisible(false);
  };

  const defaultDifficultyData = {
    numSlots: 0,
    label: 'Custom',
    icon: faSlidersH,
  };

  const currentDifficultyData =
    difficultyInfo.find((item) => item.numSlots === currentDifficulty) ||
    defaultDifficultyData;

  return (
    <div
      className="difficulty-dropdown"
      ref={dropdownRef}
      onClick={() => setDropdownVisible(!dropdownVisible)}
    >
      <div className="current-difficulty">
        <div className="difficulty-icon">
          <FontAwesomeIcon icon={currentDifficultyData.icon} size="2x" />
        </div>
        <div className="difficulty-label">{currentDifficultyData.label}</div>
      </div>
      {dropdownVisible && (
        <ul
          className={`difficulty-options ${dropdownVisible ? 'visible' : ''}`}
        >
          {difficultyInfo.map((difficulty) => (
            <li
              key={difficulty.numSlots}
              onClick={(event) =>
                handleDifficultyClick(event, difficulty.numSlots)
              }
            >
              <div className="difficulty-option">
                <div className="difficulty-option-icon">
                  <FontAwesomeIcon icon={difficulty.icon} />
                </div>
                <div className="difficulty-option-label">
                  {difficulty.label}
                </div>
                <div className="difficulty-option-number">
                  {difficulty.numSlots}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DifficultyDropdown;
