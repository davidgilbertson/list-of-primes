export const makeWheel = (primeCount) => {
  console.time(`Making wheel of ${primeCount} primes`);
  const primes = [2];

  const isPrime = (candidate) => {
    let divisor = 1;

    let safety2 = 0;
    while (true) {
      if (safety2++ > 100) throw Error();

      divisor += 2;
      if (divisor ** 2 > candidate) return true;

      if ((candidate / divisor) % 1 === 0) return false;
    }
  };

  // First we get some prime numbers.
  let primeCandidate = 1;

  let safety = 0;
  while (true) {
    if (safety++ > 100) throw Error();

    primeCandidate += 2;

    if (isPrime(primeCandidate)) {
      primes.push(primeCandidate);

      // For a wheel of size x we'll get (x + 1) primes and use the last one as
      // the 'startCandidate'
      if (primes.length > primeCount) break;
    }
  }

  const wheelPrimes = primes.slice(0, -1);

  // Now we generate the step pattern
  const arrLength = wheelPrimes.reduce((total, prime) => total * prime);
  const steps = [];
  let lastNonFactor = 1;

  for (let i = 1; i <= arrLength; i++) {
    const isFactor = !!wheelPrimes.find((prime) => (i / prime) % 1 === 0);
    if (!isFactor) {
      lastNonFactor = i;
      steps[lastNonFactor] = 0;
    }
    steps[lastNonFactor]++;
  }

  console.timeEnd(`Making wheel of ${primeCount} primes`);
  return {
    startCandidate: primes[primes.length - 1],
    primes,
    steps,
    wheelRange: arrLength,
  };
};
