import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShareFromSquare } from '@fortawesome/free-solid-svg-icons';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Slot from './Slot';
import './Game.css';
import './ToastStyles.css';

const generateRandomNumber = (slots) => {
  let randomNumber;
  do {
    randomNumber = Math.floor(Math.random() * 1000);
  } while (slots.includes(randomNumber));
  return randomNumber;
};

const numberEmoji = [
  '0️⃣',
  '1️⃣',
  '2️⃣',
  '3️⃣',
  '4️⃣',
  '5️⃣',
  '6️⃣',
  '7️⃣',
  '8️⃣',
  '9️⃣',
];

const numberToEmoji = (number) => {
  // Extract the three digits from the number
  const digits = number.toString().padStart(3, '0').split('').map(Number);

  // Convert each digit to its corresponding emoji
  // 1 = 1️⃣, 2 = 2️⃣, etc.
  const emojis = digits.map((digit) => {
    return numberEmoji[digit];
  });

  // Return the emojis as a string
  return emojis.join('');
};

const CustomCloseButton = ({ closeToast }) => {
  return (
    <button
      onClick={closeToast}
      style={{
        fontSize: '16px',
        color: 'white',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
      }}
    >
      &times;
    </button>
  );
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
  const isCustomSequence = sequence && sequence.length > 0;

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

  const shareGame = useCallback(() => {
    // Copy to clipboard the results of the game
    let shareTextBuilder = [];
    const totalSlots = slots.length;
    const shareTitle = `Perfect Sequence (${totalSlots})`;
    shareTextBuilder.push(shareTitle);

    const numFilled = slots.filter((slot) => slot !== null).length;
    const shareSummary = `${numFilled} / ${totalSlots}`;
    shareTextBuilder.push(shareSummary);

    const gameBreakdown = slots
      .map((slot) => {
        if (slot === null) {
          return '❌❌❌';
        } else {
          return numberToEmoji(slot);
        }
      })
      .join('\n');
    shareTextBuilder.push(gameBreakdown);

    shareTextBuilder.push('-------');

    if (gameState === GameState.Lost) {
      shareTextBuilder.push(`${numberToEmoji(currentNumber)}`);
    } else {
      shareTextBuilder.push('🎉🎉🎉');
    }

    const shareLink = '\nhttps://dclamage.github.io/perfect-sequence';
    shareTextBuilder.push(shareLink);

    const shareText = shareTextBuilder.join('\n');
    navigator.clipboard
      .writeText(shareText)
      .then(() => {
        toast.success('Copied to clipboard!', {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 3000,
          className: 'custom-toast-success',
          progressClassName: 'custom-toast-progress',
          bodyClassName: 'custom-toast-container',
          closeButton: <CustomCloseButton />,
        });
      })
      .catch(() => {
        toast.error('Failed to copy to clipboard', {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 3000,
          className: 'custom-toast-error',
          progressClassName: 'custom-toast-progress',
          bodyClassName: 'custom-toast-container',
          closeButton: <CustomCloseButton />,
        });
      });
  }, [slots, currentNumber, gameState]);

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
      if (lastReportedGameId !== gameId && !isCustomSequence) {
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
      <div className="number-display">
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
      {gameState !== GameState.InProgress && (
        <div className="controls">
          <button onClick={resetGame} className="reset-button">
            New Game
          </button>
          <button onClick={shareGame} className="copy-button">
            <FontAwesomeIcon icon={faShareFromSquare} /> Share Results
          </button>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default Game;
