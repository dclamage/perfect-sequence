import { encodeSequence } from './sequenceUtil';

export const generateUrlFromSequence = (sequence) => {
  const encodedSequence = encodeSequence(sequence);
  const baseUrl = window.location.origin + window.location.pathname;
  const urlWithSequence = `${baseUrl}?seq=${encodedSequence}`;
  return urlWithSequence;
};
