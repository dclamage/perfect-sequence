// External dependencies
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  faQuestionCircle,
  faBarChart,
} from '@fortawesome/free-regular-svg-icons';
import {
  faStarHalfAlt,
  faStar,
  faShieldAlt,
  faRocket,
  faSkullCrossbones,
} from '@fortawesome/free-solid-svg-icons';

// Components
import Game from './components/Game';
import HelpDialog from './components/HelpDialog';
import MenuIcon from './components/MenuIcon';
import SequenceGenerator from './components/SequenceGenerator';
import StatsDialog from './components/StatsDialog';
import DifficultyDropdown from './components/DifficultyDropdown';

// Utils
import { decodeSequence } from './sequenceUtil';

// Assets
import logo from './logo.png';

// Styles
import './App.css';

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

  const showDialog = (dialog) => {
    setShowStatsDialog(dialog === DIALOGS.STATS);
    setShowHelpDialog(dialog === DIALOGS.HELP);
    setShowSequenceGenerator(dialog === DIALOGS.SEQUENCE_GENERATOR);
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-content">
          <div className="header-logo-container">
            <img src={logo} className="App-logo" alt="logo" />
          </div>
          <div className="header-title-container">
            <h1>Perfect Sequence</h1>
          </div>
          <div className="menu-icons-container">
            <DifficultyDropdown
              difficultyInfo={difficultyInfo}
              currentDifficulty={totalSlots}
              onDifficultyChange={setTotalSlots}
            />
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
