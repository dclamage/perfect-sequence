import React from 'react';
import { slide as Menu } from 'react-burger-menu';
import './HamburgerMenu.css';

const HamburgerMenu = ({
  setTotalSlots,
  isOpen,
  onStateChange,
  setShowHelpDialog,
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
        <button className="menu-item" onClick={() => handleDifficultyChange(4)}>
          <i className="fa fa-star"></i>
          Easy (4)
        </button>
        <button className="menu-item" onClick={() => handleDifficultyChange(8)}>
          <i className="fa fa-star-half-o"></i>
          Medium (8)
        </button>
        <button
          className="menu-item"
          onClick={() => handleDifficultyChange(12)}
        >
          <i className="fa fa-star-o"></i>
          Hard (12)
        </button>
        <button
          className="menu-item"
          onClick={() => handleDifficultyChange(20)}
        >
          <i className="fa fa-trophy"></i>
          Impossible (20)
        </button>
        <button className="menu-item" onClick={handleHelpClick}>
          <i className="fa fa-question-circle"></i>
          Help
        </button>
      </Menu>
    </div>
  );
};

export default HamburgerMenu;
