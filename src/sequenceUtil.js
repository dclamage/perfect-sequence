export const encodeSequence = (sequence) => {
  const sequenceString = sequence.join(',');
  return btoa(sequenceString);
};

// Update the decodeSequence function
export const decodeSequence = (encodedSequence) => {
  const sequenceString = atob(encodedSequence);
  return sequenceString.split(',').map(Number);
};

export const generateSequence = (totalSlots, sequence = []) => {
  const seq = new Array(totalSlots).fill(0);

  for (let i = 0; i < totalSlots; i++) {
    if (sequence.length > i) {
      seq[i] = sequence[i];
    } else {
      seq[i] = Math.floor(Math.random() * totalSlots) + 1;
    }
  }

  return seq;
};
