import { makeWheel } from "./makeWheel";

// Make a wheel, bigger is faster to process, but slower to create on page load
// 6 or 7 work well
const wheelData = makeWheel(6);
console.log(wheelData);

let candidate = wheelData.startCandidate;

// Keep a register of upcoming numbers that are not prime
// This will contain one entry for each discovered prime.
// The key is the product of the prime and some factor, the value is the factor.
const futureNonPrimes = new Map();
futureNonPrimes.set(wheelData.startCandidate ** 2, wheelData.startCandidate);

// To prevent an out of range error, we'll only store records for ~2 million primes (up to the prime 31,622,777).
// The list can then be maintained up to the first non-prime
// that would have this as a factor, which is 1,000,000,025,191,729.
const MAX_PRIME = 10 ** 15; // 1,000 trillion

export const getStartPrimes = () => wheelData.primes.slice();

export const getNextPrime = () => {
  while (true) {
    // We only visit numbers that aren't multiples of 2, 3, 5 ...
    candidate += wheelData.steps[candidate % wheelData.wheelRange];

    if (candidate > MAX_PRIME) throw Error(`No more primes for you.`);

    let factor = futureNonPrimes.get(candidate);

    // If it's not non-prime, it's prime
    if (!factor) {
      // Start tracking certain multiples of this prime
      if (candidate * candidate < MAX_PRIME) {
        futureNonPrimes.set(candidate * candidate, candidate);
      }

      return candidate;
    }

    // Else this is not a prime, let's maintain the future-non-prime list

    // We don't need this entry any more
    futureNonPrimes.delete(candidate);

    const primeFactor = candidate / factor;

    while (true) {
      // Increase the factor in the same way we increment the prime candidate
      factor += wheelData.steps[factor % wheelData.wheelRange];

      const nextNonPrime = primeFactor * factor;

      // If this non-prime is already documented, we'll move on to the next one
      if (!futureNonPrimes.has(nextNonPrime)) {
        futureNonPrimes.set(nextNonPrime, factor);
        break;
      }
    }
  }
};

export const reset = () => (candidate = wheelData.startCandidate);
