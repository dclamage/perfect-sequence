import React from 'react';
import './StatsDialog.css';

const StatsDialog = ({ difficulty, stats, onClose }) => {
  if (!stats) {
    stats = {
      gamesPlayed: 0,
      gamesWon: 0,
      histogram: {},
    };
  }

  const winRate = (stats.gamesWon / stats.gamesPlayed) * 100;
  let winRateString;
  if (winRate === 0 || isNaN(winRate)) {
    winRateString = '0';
  } else if (winRate >= 1) {
    winRateString = winRate.toFixed(0);
  } else if (winRate >= 0.1) {
    winRateString = winRate.toFixed(1);
  } else if (winRate >= 0.01) {
    winRateString = winRate.toFixed(2);
  } else if (winRate >= 0.001) {
    winRateString = winRate.toFixed(3);
  } else if (winRate >= 0.0001) {
    winRateString = winRate.toFixed(4);
  } else {
    winRateString = winRate.toFixed(5);
  }

  return (
    <div className="game-stats-dialog-overlay">
      <div className="game-stats-dialog">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h2 className="game-stats-title">Statistics ({difficulty})</h2>
        <div className="game-stats">
          <div className="game-stats-numbers-row">
            <div className="game-stats-entry">
              <div className="game-stats-number">{stats.gamesPlayed}</div>
              <div className="game-stats-label">Played</div>
            </div>
            <div className="game-stats-entry">
              <div className="game-stats-number">{stats.gamesWon}</div>
              <div className="game-stats-label">Won</div>
            </div>
            <div className="game-stats-entry">
              <div className="game-stats-number">{winRateString}%</div>
              <div className="game-stats-label">Win %</div>
            </div>
          </div>

          <div className="histogram">
            <div className="histogram-label-column">
              <div className="histogram-header-row">
                <div className="histogram-header-label">Placed</div>
              </div>
              {Array.from({ length: difficulty }, (_, i) => ({
                id: 'histogram-label-' + i,
                label: i + 1,
              })).map(({ id, label }) => (
                <div className="histogram-row" key={id}>
                  <div className="histogram-row-label">{label}</div>
                </div>
              ))}
            </div>
            <div className="histogram-bar-column">
              <div className="histogram-header-row">
                <div className="histogram-header-label">Number of Games</div>
              </div>
              {Array.from({ length: difficulty }, (_, i) => ({
                id: 'histogram-bar-' + i,
                count: stats.histogram[i] || 0,
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
