import React, { useState, useEffect } from 'react';
import './App.css';
import Game from './components/Game';
import logo from './logo.png';
import HamburgerMenu from './components/HamburgerMenu';
import Hamburger from './components/Hamburger';
import HelpDialog from './components/HelpDialog';
import SequenceGenerator from './components/SequenceGenerator';
import 'font-awesome/css/font-awesome.min.css';
import { decodeSequence } from './sequenceUtil';
import { useLocation } from 'react-router-dom';

function useQueryHook() {
  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };

  return useQuery();
}

function App() {
  const [totalSlots, setTotalSlots] = useState(8);
  const [menuVisible, setMenuVisible] = useState(false);
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const [sequence, setSequence] = useState([]);
  const [showSequenceGenerator, setShowSequenceGenerator] = useState(false);
  const [sequenceGeneratorHasClosed, setSequenceGeneratorHasClosed] =
    useState(false);

  const query = useQueryHook();

  useEffect(() => {
    if (!sequenceGeneratorHasClosed && query.get('showGenerator') === '1') {
      setShowSequenceGenerator(true);
    }
  }, [query, sequenceGeneratorHasClosed]);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const encodedSequence = searchParams.get('seq');
    if (encodedSequence) {
      setSequence(decodeSequence(encodedSequence));
    }
  }, []);

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
          setShowHelpDialog={setShowHelpDialog}
        />
      )}
      {showHelpDialog && (
        <HelpDialog onClose={() => setShowHelpDialog(false)} />
      )}
      <Game totalSlots={totalSlots} sequence={sequence} />
      {showSequenceGenerator && (
        <SequenceGenerator
          onClose={() => {
            setShowSequenceGenerator(false);
            setSequenceGeneratorHasClosed(true);
          }}
        />
      )}
    </div>
  );
}

export default App;
