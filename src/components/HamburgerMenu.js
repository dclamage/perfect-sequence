import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons';
import { slide as Menu } from 'react-burger-menu';
import './HamburgerMenu.css';

const HamburgerMenu = ({
  setTotalSlots,
  isOpen,
  onStateChange,
  setShowHelpDialog,
  difficultyInfo,
}) => {
  const handleDifficultyChange = (numSlots) => {
    setTotalSlots(numSlots);
    onStateChange({ isOpen: false });
  };

  const handleHelpClick = () => {
    setShowHelpDialog(true);
    onStateChange({ isOpen: false });
  };

  return (
    <div className="menu">
      <Menu isOpen={isOpen} onStateChange={onStateChange} disableAutoFocus>
        {difficultyInfo.map((difficulty) => (
          <button
            key={difficulty.label}
            className="menu-item"
            onClick={() => handleDifficultyChange(difficulty.numSlots)}
          >
            <FontAwesomeIcon icon={difficulty.icon} />
            {difficulty.label} ({difficulty.numSlots})
          </button>
        ))}
        <button className="menu-item" onClick={handleHelpClick}>
          <FontAwesomeIcon icon={faQuestionCircle} />
          Help
        </button>
      </Menu>
    </div>
  );
};

export default HamburgerMenu;
