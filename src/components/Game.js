import React, { useState, useEffect, useCallback } from 'react';
import './Game.css';
import Slot from './Slot';

const generateRandomNumber = (slots) => {
  let randomNumber;
  do {
    randomNumber = Math.floor(Math.random() * 1000);
  } while (slots.includes(randomNumber));
  return randomNumber;
};

const GameState = {
  InProgress: 0,
  Lost: 1,
  Won: 2,
  Resetting: 3,
};

const Game = ({ totalSlots, sequence, onGameEnd }) => {
  const [slots, setSlots] = useState(Array(totalSlots).fill(null));
  const [sequenceIndex, setSequenceIndex] = useState(0);
  const [currentNumber, setCurrentNumber] = useState(() => {
    return sequence[sequenceIndex] || generateRandomNumber(slots);
  });
  const [gameState, setGameState] = useState(GameState.InProgress);
  const [gameId, setGameId] = useState(0);
  const [lastReportedGameId, setLastReportedGameId] = useState(-1);

  const isReceivable = useCallback(
    (index) => {
      const slot = slots[index];
      if (slot !== null) return false;

      const prevFilledIndex = slots
        .slice(0, index)
        .reverse()
        .findIndex((slot) => slot !== null);

      const nextFilledIndex = slots
        .slice(index + 1)
        .findIndex((slot) => slot !== null);

      const prevSlotValue =
        prevFilledIndex >= 0 ? slots[index - 1 - prevFilledIndex] : -Infinity;
      const nextSlotValue =
        nextFilledIndex >= 0 ? slots[index + 1 + nextFilledIndex] : Infinity;

      return prevSlotValue < currentNumber && nextSlotValue > currentNumber;
    },
    [slots, currentNumber]
  );

  const handleSlotClick = (index) => {
    if (!isReceivable(index)) return;

    const updatedSlots = [...slots];
    updatedSlots[index] = currentNumber;
    setSlots(updatedSlots);
    setSequenceIndex((prevIndex) => prevIndex + 1);
    setCurrentNumber(
      sequence[sequenceIndex + 1] || generateRandomNumber(updatedSlots)
    );
  };

  const resetGame = useCallback(() => {
    setGameState(GameState.Resetting);
  }, []);

  useEffect(() => {
    if (gameState === GameState.Resetting) return;

    if (slots.every((slot) => slot !== null)) {
      setGameState(GameState.Won);
    } else if (slots.every((_, i) => !isReceivable(i))) {
      setGameState(GameState.Lost);
    } else {
      setGameState(GameState.InProgress);
    }
  }, [slots, gameState, isReceivable]);

  useEffect(() => {
    if (gameState !== GameState.InProgress) {
      if (lastReportedGameId !== gameId) {
        const filledSlots = slots.filter((slot) => slot !== null).length;
        if (filledSlots !== 0) {
          onGameEnd(gameState === GameState.Won, slots.length, filledSlots);
          setLastReportedGameId(gameId);
        }
      }

      if (gameState === GameState.Resetting) {
        setGameState(GameState.InProgress);

        const newSlots = Array(totalSlots).fill(null);
        setSlots(newSlots);
        setCurrentNumber(sequence[0] || generateRandomNumber(newSlots));
        setSequenceIndex(0);
        setGameId((prevId) => prevId + 1);
      }
    }
  }, [
    gameState,
    slots,
    lastReportedGameId,
    gameId,
    totalSlots,
    sequence,
    onGameEnd,
  ]);

  useEffect(() => {
    setGameState(GameState.Resetting);
  }, [totalSlots, resetGame]);

  const column1Size = Math.ceil(slots.length / 2);
  return (
    <div className="Game">
      <div className="controls">
        {gameState === GameState.Won ? (
          <div className="won">You Won!</div>
        ) : gameState === GameState.Lost ? (
          <div className="game-over">{currentNumber}</div>
        ) : (
          <div className="current-number">{currentNumber}</div>
        )}
      </div>
      <div className="slots-container">
        <div className="column">
          {Array.from({ length: column1Size }, (_, index) => (
            <div className="slot-wrapper" key={index}>
              <div className="slot-label">{index + 1}</div>
              <Slot
                value={slots[index]}
                onClick={() => handleSlotClick(index)}
                receivable={isReceivable(index)}
              />
            </div>
          ))}
        </div>
        <div className="column">
          {Array.from({ length: slots.length - column1Size }, (_, index) => (
            <div className="slot-wrapper" key={index + column1Size}>
              <div className="slot-label">{index + column1Size + 1}</div>
              <Slot
                value={slots[index + column1Size]}
                onClick={() => handleSlotClick(index + column1Size)}
                receivable={isReceivable(index + column1Size)}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="controls">
        <button onClick={resetGame} className="reset-button">
          New Game
        </button>
      </div>
    </div>
  );
};

export default Game;
