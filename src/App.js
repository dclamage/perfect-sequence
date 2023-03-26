import React, { useState } from 'react';
import './App.css';
import Game from './components/Game';
import logo from './logo.png';
import HamburgerMenu from './components/HamburgerMenu';
import Hamburger from './components/Hamburger';
import HelpDialog from './components/HelpDialog';
import 'font-awesome/css/font-awesome.min.css';

function App() {
  const [totalSlots, setTotalSlots] = useState(8);
  const [menuVisible, setMenuVisible] = useState(false);
  const [showHelpDialog, setShowHelpDialog] = useState(false);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-content">
          <Hamburger onClick={toggleMenu} />
          <div className="logo-title-container">
            <img src={logo} className="App-logo" alt="logo" />
            <h1>Perfect Sequence</h1>
          </div>
        </div>
      </header>
      {menuVisible && (
        <HamburgerMenu
          setTotalSlots={setTotalSlots}
          isOpen={menuVisible}
          onStateChange={({ isOpen }) => setMenuVisible(isOpen)}
          showHelpDialog={showHelpDialog}
          setShowHelpDialog={setShowHelpDialog}
        />
      )}
      {showHelpDialog && (
        <HelpDialog onClose={() => setShowHelpDialog(false)} />
      )}
      <Game totalSlots={totalSlots} />
    </div>
  );
}

export default App;
