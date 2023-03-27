import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './DifficultyChoiceRow.css';

const DifficultyChoiceRow = ({
  difficultyInfo,
  currentDifficulty,
  changeDifficulty,
}) => {
  return (
    <div className="difficulty-choice-row">
      {difficultyInfo.map((difficultyEntry, index) => (
        <React.Fragment key={difficultyEntry.label}>
          <div className="difficulty-choice-entry-container">
            <div
              className={
                difficultyEntry.numSlots === currentDifficulty
                  ? 'difficulty-choice-entry difficulty-choice-entry-current'
                  : 'difficulty-choice-entry'
              }
            >
              <FontAwesomeIcon
                icon={difficultyEntry.icon}
                onClick={() => changeDifficulty(difficultyEntry.numSlots)}
              />
              <div
                className="difficulty-choice-label"
                onClick={() => changeDifficulty(difficultyEntry.numSlots)}
              >
                {difficultyEntry.label}
              </div>
            </div>
          </div>
          {index < difficultyInfo.length - 1 && (
            <div className="separator-container">
              <div className="difficulty-choice-vertical-separator"></div>
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default DifficultyChoiceRow;
