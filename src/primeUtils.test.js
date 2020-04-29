import { getNextPrime, reset } from './primeUtils';

test('getNextPrime', () => {
  reset();

  // The start point depends on the size of the wheel.
  // This will probably stay at 6.
  expect(getNextPrime()).toBe(19);
  expect(getNextPrime()).toBe(23);
  expect(getNextPrime()).toBe(29);
  expect(getNextPrime()).toBe(31);
  expect(getNextPrime()).toBe(37);
  expect(getNextPrime()).toBe(41);
  expect(getNextPrime()).toBe(43);
  expect(getNextPrime()).toBe(47);
  expect(getNextPrime()).toBe(53);
  expect(getNextPrime()).toBe(59);
  expect(getNextPrime()).toBe(61);
  expect(getNextPrime()).toBe(67);
  expect(getNextPrime()).toBe(71);
  expect(getNextPrime()).toBe(73);
  expect(getNextPrime()).toBe(79);
  expect(getNextPrime()).toBe(83);
  expect(getNextPrime()).toBe(89);
  expect(getNextPrime()).toBe(97);
  expect(getNextPrime()).toBe(101);

  // Skip ahead to prime 1,000,000
  Array(1000000 - 27)
    .fill('')
    .forEach(getNextPrime);

  expect(getNextPrime()).toBe(15485863);
});
