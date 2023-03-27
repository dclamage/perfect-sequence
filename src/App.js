import React, { useState, useEffect } from 'react';
import {
  faStarHalfAlt,
  faStar,
  faShieldAlt,
  faRocket,
  faSkullCrossbones,
} from '@fortawesome/free-solid-svg-icons';
import {
  faQuestionCircle,
  faBarChart,
} from '@fortawesome/free-regular-svg-icons';
import 'font-awesome/css/font-awesome.min.css';
import './App.css';
import Game from './components/Game';
import logo from './logo.png';
import HamburgerMenu from './components/HamburgerMenu';
import Hamburger from './components/Hamburger';
import HelpDialog from './components/HelpDialog';
import SequenceGenerator from './components/SequenceGenerator';
import StatsDialog from './components/StatsDialog';
import MenuIcon from './components/MenuIcon';
import { decodeSequence } from './sequenceUtil';
import { useLocation } from 'react-router-dom';

const difficultyInfo = [
  {
    label: 'Easy',
    numSlots: 4,
    icon: faStarHalfAlt,
  },
  {
    label: 'Medium',
    numSlots: 8,
    icon: faStar,
  },
  {
    label: 'Hard',
    numSlots: 12,
    icon: faShieldAlt,
  },
  {
    label: 'Expert',
    numSlots: 16,
    icon: faRocket,
  },
  {
    label: 'Impossible',
    numSlots: 20,
    icon: faSkullCrossbones,
  },
];

// Dialog enum
const DIALOGS = {
  NONE: 'none',
  HELP: 'help',
  STATS: 'stats',
  SEQUENCE_GENERATOR: 'sequenceGenerator',
};

function useQueryHook() {
  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };

  return useQuery();
}

function App() {
  const [totalSlots, setTotalSlots] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const [sequence, setSequence] = useState([]);
  const [showSequenceGenerator, setShowSequenceGenerator] = useState(false);
  const [sequenceGeneratorHasClosed, setSequenceGeneratorHasClosed] =
    useState(false);

  const [showStatsDialog, setShowStatsDialog] = useState(false);
  const [gameStats, setGameStats] = useState(() => {
    const storedStats = localStorage.getItem('stats');
    return storedStats ? JSON.parse(storedStats) : {};
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const encodedSequence = searchParams.get('seq');
    if (encodedSequence) {
      const decodedSequence = decodeSequence(encodedSequence);
      setSequence(decodedSequence);
      setTotalSlots(decodedSequence.length);
    } else {
      const storedDifficulty = localStorage.getItem('lastDifficulty');
      if (storedDifficulty) {
        setTotalSlots(Number(storedDifficulty));
      } else {
        setTotalSlots(8);
      }
    }
  }, []);

  const onGameEnd = (won, totalSlots, filledSlots) => {
    // Get existing stats from local storage
    const storedStats = localStorage.getItem('stats');
    const stats = storedStats ? JSON.parse(storedStats) : {};

    // Update stats object
    const difficulty = totalSlots;
    if (!stats[difficulty]) {
      stats[difficulty] = {
        gamesPlayed: 0,
        gamesWon: 0,
        histogram: {},
      };
    }

    stats[difficulty].gamesPlayed += 1;
    if (won) stats[difficulty].gamesWon += 1;

    if (!stats[difficulty].histogram[filledSlots]) {
      stats[difficulty].histogram[filledSlots] = 0;
    }
    stats[difficulty].histogram[filledSlots] += 1;

    // Save updated stats to local storage
    localStorage.setItem('stats', JSON.stringify(stats));

    // Update local state with new stats
    setGameStats(stats);

    // Log
    console.log('Game ended', { won, totalSlots, filledSlots });
    // Log stats
    console.log('Stats', stats);
  };

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

  // Update local storage for total slots, but only if
  // it has already been loaded from local storage
  useEffect(() => {
    if (totalSlots) {
      localStorage.setItem('lastDifficulty', totalSlots);
    }
  }, [totalSlots]);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const showDialog = (dialog) => {
    setShowStatsDialog(dialog === DIALOGS.STATS);
    setShowHelpDialog(dialog === DIALOGS.HELP);
    setShowSequenceGenerator(dialog === DIALOGS.SEQUENCE_GENERATOR);
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
          <div className="menu-icons-container">
            <MenuIcon
              onClick={() => showDialog(DIALOGS.HELP)}
              size="2x"
              icon={faQuestionCircle}
            />
            <MenuIcon
              onClick={() => showDialog(DIALOGS.STATS)}
              size="2x"
              icon={faBarChart}
            />
          </div>
        </div>
      </header>
      {menuVisible && (
        <HamburgerMenu
          setTotalSlots={setTotalSlots}
          isOpen={menuVisible}
          onStateChange={({ isOpen }) => setMenuVisible(isOpen)}
          setShowHelpDialog={() => showDialog(DIALOGS.HELP)}
          difficultyInfo={difficultyInfo}
        />
      )}
      {showHelpDialog && (
        <HelpDialog onClose={() => setShowHelpDialog(false)} />
      )}
      <Game totalSlots={totalSlots} sequence={sequence} onGameEnd={onGameEnd} />
      {showSequenceGenerator && (
        <SequenceGenerator
          onClose={() => {
            setShowSequenceGenerator(false);
            setSequenceGeneratorHasClosed(true);
          }}
        />
      )}
      {showStatsDialog && (
        <StatsDialog
          initialDifficulty={totalSlots}
          allStats={gameStats}
          onClose={() => setShowStatsDialog(false)}
          difficultyInfo={difficultyInfo}
        />
      )}
    </div>
  );
}

export default App;
