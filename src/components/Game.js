import React, { useState, useEffect, useCallback } from 'react';
import './Game.css';
import Slot from './Slot';

const TOTAL_SLOTS = 20;

const generateRandomNumber = (slots) => {
  let randomNumber;
  do {
    randomNumber = Math.floor(Math.random() * 1000);
  } while (slots.includes(randomNumber));
  return randomNumber;
};

function Game() {
  const [slots, setSlots] = useState(Array(TOTAL_SLOTS).fill(null));
  const [currentNumber, setCurrentNumber] = useState(() => {
    return generateRandomNumber(slots);
  });
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

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
    setCurrentNumber(generateRandomNumber(updatedSlots));

    const gameOver = updatedSlots.every((_, i) => !isReceivable(i));
    setGameOver(gameOver);

    const won = updatedSlots.every((slot) => slot !== null);
    setWon(won);
  };

  const resetGame = () => {
    const newSlots = Array(TOTAL_SLOTS).fill(null);
    setSlots(newSlots);
    setCurrentNumber(generateRandomNumber(newSlots));
    setGameOver(false);
  };

  useEffect(() => {
    if (slots.every((_, index) => !isReceivable(index))) {
      setGameOver(true);
    }
  }, [slots, isReceivable]);

  const column1Size = Math.ceil(slots.length / 2);
  return (
    <div className="Game">
      <div className="controls">
        {won ? (
          <div className="won">You Won!</div>
        ) : gameOver ? (
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
          Reset
        </button>
      </div>
    </div>
  );
}

export default Game;
