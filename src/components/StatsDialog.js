import React, { useState, useEffect } from 'react';
import './StatsDialog.css';
import GameStatsRow from './GameStatsRow';
import DifficultyChoiceRow from './DifficultyChoiceRow';

const StatsDialog = ({
  initialDifficulty,
  allStats,
  onClose,
  difficultyInfo,
}) => {
  const [displayedDifficulty, setDisplayedDifficulty] =
    useState(initialDifficulty);
  const [stats, setStats] = useState(
    allStats[initialDifficulty] || {
      gamesPlayed: 0,
      gamesWon: 0,
      histogram: {},
    }
  );
  const [winRateString, setWinRateString] = useState('0');
  const [meanScore, setMeanScore] = useState(0);
  const [medianScore, setMedianScore] = useState(0);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleDifficultyChange = (newDifficulty) => {
    setDisplayedDifficulty(newDifficulty);
  };

  useEffect(() => {
    setStats(
      allStats[displayedDifficulty] || {
        gamesPlayed: 0,
        gamesWon: 0,
        histogram: {},
      }
    );
  }, [displayedDifficulty, allStats]);

  useEffect(() => {
    const difficulty = displayedDifficulty;

    const winRate = (stats.gamesWon / stats.gamesPlayed) * 100;
    if (winRate === 0 || isNaN(winRate)) {
      setWinRateString('0');
    } else if (winRate >= 1) {
      setWinRateString(winRate.toFixed(0));
    } else if (winRate >= 0.1) {
      setWinRateString(winRate.toFixed(1));
    } else if (winRate >= 0.01) {
      setWinRateString(winRate.toFixed(2));
    } else if (winRate >= 0.001) {
      setWinRateString(winRate.toFixed(3));
    } else if (winRate >= 0.0001) {
      setWinRateString(winRate.toFixed(4));
    } else {
      setWinRateString(winRate.toFixed(5));
    }

    const histogramArray = [];
    for (let i = 0; i <= difficulty; i++) {
      histogramArray.push(stats.histogram[i] || 0);
    }

    const totalScore = histogramArray.reduce((acc, val, index) => {
      return acc + val * index;
    }, 0);

    setMeanScore((totalScore / stats.gamesPlayed || 0).toFixed(1));

    // Calculate the median score
    let medianScore = 0;
    if (stats.gamesPlayed > 0) {
      let sum = 0;
      let target = stats.gamesPlayed / 2;

      for (let i = 0; i <= difficulty; i++) {
        sum += histogramArray[i];
        if (sum >= target) {
          if (stats.gamesPlayed % 2 === 0 && sum === target) {
            // Find the next non-zero value
            let j = i + 1;
            while (j <= difficulty && histogramArray[j] === 0) {
              j++;
            }
            if (j <= difficulty) {
              medianScore = (i + j) / 2;
            } else {
              medianScore = i;
            }
          } else {
            medianScore = i;
          }
          break;
        }
      }
    }
    setMedianScore(medianScore);
  }, [displayedDifficulty, stats, difficultyInfo]);

  return (
    <div className="game-stats-dialog-overlay" onClick={handleOverlayClick}>
      <div className="game-stats-dialog">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <div className="game-stats-top-container">
          <h2 className="game-stats-title">Statistics</h2>
          <DifficultyChoiceRow
            difficultyInfo={difficultyInfo}
            currentDifficulty={displayedDifficulty}
            changeDifficulty={handleDifficultyChange}
          />
          <GameStatsRow
            statsData={[
              { label: 'Played', value: stats.gamesPlayed },
              { label: 'Won', value: stats.gamesWon },
              { label: 'Win %', value: `${winRateString}%` },
              { label: 'Avg. Score', value: meanScore },
              { label: 'Med. Score', value: medianScore },
            ]}
          />
        </div>
        <div className="histogram-container">
          <div className="histogram-header">
            <div className="histogram-header-label">Score</div>
            <div className="histogram-header-label">Games</div>
          </div>
          <div className="histogram-content">
            <div className="histogram-label-column">
              {Array.from({ length: displayedDifficulty }, (_, i) => ({
                id: 'histogram-label-' + (i + 1),
                label: i + 1,
              })).map(({ id, label }) => (
                <div className="histogram-row" key={id}>
                  <div className="histogram-row-label">{label}</div>
                </div>
              ))}
            </div>
            <div className="histogram-bar-column">
              {Array.from({ length: displayedDifficulty }, (_, i) => ({
                id: 'histogram-bar-' + (i + 1),
                count: stats.histogram[i + 1] || 0,
              })).map(({ id, count }) => (
                <div className="histogram-row" key={id}>
                  <div className="histogram-row-bar">
                    <div
                      className="histogram-row-bar-fill"
                      style={{
                        width: `${10 + (count / stats.gamesPlayed || 0) * 90}%`,
                      }}
                    >
                      {' '}
                      {count > -1 && (
                        <div className="histogram-row-count">{count}</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsDialog;
