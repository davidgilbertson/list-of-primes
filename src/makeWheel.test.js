import { makeWheel } from './makeWheel';

test('makeWheel', () => {
  expect(makeWheel(1)).toEqual({
    startCandidate: 3,
    steps: [undefined, 2],
    primes: [2, 3],
    wheelRange: 2,
  });

  expect(makeWheel(2)).toEqual({
    startCandidate: 5,
    steps: [undefined, 4, undefined, undefined, undefined, 2],
    primes: [2, 3, 5],
    wheelRange: 6,
  });

  expect(makeWheel(3)).toEqual({
    startCandidate: 7,
    steps: [
      undefined,
      6,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      4,
      undefined,
      undefined,
      undefined,
      2,
      undefined,
      4,
      undefined,
      undefined,
      undefined,
      2,
      undefined,
      4,
      undefined,
      undefined,
      undefined,
      6,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      2,
    ],
    primes: [2, 3, 5, 7],
    wheelRange: 30,
  });
});
