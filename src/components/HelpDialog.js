import React from 'react';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import { faYoutube, faGithub } from '@fortawesome/free-brands-svg-icons';
import './HelpDialog.css';
import logo from '../logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const HelpDialog = ({ onClose }) => {
  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="help-dialog-overlay" onClick={handleOverlayClick}>
      <div className="help-dialog">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <img src={logo} className="App-logo" alt="logo" />
        <h2 className="help-title">About Perfect Sequence</h2>
        <p>
          Welcome to Perfect Sequence! To play the game, place the randomly
          picked number (0 to 999) into an available slot. The goal is to create
          a sequence of numbers in ascending order, but you don't know what
          future numbers will be! The game ends when you have filled all the
          slots or when a number is picked that cannot be placed in any of the
          slots.
        </p>
        <p>
          To change the game's difficulty, open the menu by clicking on the
          hamburger icon and select the desired difficulty level.
        </p>
        <div className="links">
          <p className="created-by">
            Created by <span>Rangsk</span>
          </p>
          <p>
            <a
              className="youtube-link"
              href="https://www.youtube.com/c/rangsk"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={faYoutube} /> YouTube
            </a>
            <a
              className="github-link"
              href="https://github.com/dclamage"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={faGithub} /> GitHub
            </a>
          </p>
          <p>
            <a
              className="kofi-link"
              href="https://ko-fi.com/rangsk"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={faCoffee} /> Buy me a Coffee
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default HelpDialog;
