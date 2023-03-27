import React from 'react';
import './GameStatsRow.css';

const GameStatsRow = ({ statsData }) => {
  return (
    <div className="game-stats-numbers-row">
      {statsData.map((entry, index) => (
        <React.Fragment key={entry.label}>
          <div className="game-stats-entry-container">
            <div className="game-stats-entry">
              <div className="game-stats-number">{entry.value}</div>
              <div className="game-stats-label">{entry.label}</div>
            </div>
          </div>
          {index < statsData.length - 1 && (
            <div className="separator-container">
              <div className="game-stats-vertical-separator"></div>
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default GameStatsRow;
