/**
 * This module maintains the interface.
 * All prime-generating logic is in primeUtils.js
 */
import { getNextPrime, reset, getStartPrimes } from './primeUtils';

reset(); // CodeSandbox executes this file multiple times

const primesEl = document.getElementById('primes');
const msgEl = document.getElementById('msg');
const skipButtonEl = document.getElementById('skip');
const commasButtonEl = document.getElementById('commas');
const saveButtonEl = document.getElementById('save');

const BATCH_MS = 3; // Leave plenty of time for re-rendering to stay at 60 FPS
let showCommas = !!(
  window.localStorage && localStorage.showCommas === String(true)
);
const appendPrime = (el, prime) => {
  const p = document.createElement('p');
  p.textContent = showCommas ? prime.toLocaleString() : prime;
  el.appendChild(p);
};

// We track the complete list of primes in this module, since it isn't part of the
// prime-generating logic - it only exists for saving to disk.
const primesForDownload = getStartPrimes();

primesForDownload.forEach((prime) => appendPrime(primesEl, prime));

const getAndStorePrime = () => {
  const prime = getNextPrime();
  // 50 million primes is a 500 MB file, that's plenty.
  if (primesForDownload.length < 50000000) primesForDownload.push(prime);
  return prime;
};

// Append as many primes as possible in BATCH_MS
const appendBatchOfPrimes = () => {
  const primes = [];
  const start = performance.now();
  const fragment = document.createDocumentFragment();

  while (performance.now() - start <= BATCH_MS) {
    primes.push(getAndStorePrime());
  }

  const totalTime = performance.now() - start;
  const totalCount = primes[primes.length - 1] - primes[0];

  // This does mean two loops, but gives a more pure primes/sec reading
  primes.forEach((prime) => {
    appendPrime(fragment, prime);
  });

  primesEl.appendChild(fragment);

  msgEl.textContent = `Scan rate: ${Math.round(
    (totalCount / totalTime) * 1000
  ).toLocaleString()}/second`;

  saveButtonEl.textContent = `Save ${primesForDownload.length.toLocaleString()} primes`;
};

const fillScreenWithPrimes = () => {
  while (primesEl.scrollHeight < window.innerHeight) {
    appendBatchOfPrimes();
  }
};

// We start by filling the screen with primes.
// Protect against this code running while the unit test tab is open,
// in which case the scroll height doesn't increase
if (primesEl.scrollHeight > 0) {
  fillScreenWithPrimes();
}

window.addEventListener(
  'scroll',
  () => {
    if (primesEl.scrollHeight - window.innerHeight - window.scrollY < 1000) {
      appendBatchOfPrimes();
    }
  },
  { passive: true }
);

const skipAheadByX = (skip = 1000000) => {
  let prime = 0;

  const processUpTo = Math.ceil(getAndStorePrime() / skip) * skip;

  primesEl.innerHTML = '';
  window.scrollTo(0, 0);

  while (true) {
    prime = getAndStorePrime();
    if (prime > processUpTo) {
      appendPrime(primesEl, prime);
      break;
    }
  }

  fillScreenWithPrimes();
};

skipButtonEl.addEventListener('click', () => {
  skipAheadByX(1000000);
});

commasButtonEl.addEventListener('click', () => {
  showCommas = !showCommas;
  localStorage.showCommas = String(showCommas);

  Array.from(document.querySelectorAll('#primes p')).forEach((el) => {
    const newText = showCommas
      ? Number(el.textContent).toLocaleString()
      : el.textContent.replace(/,/g, '');

    el.textContent = newText;
  });
});

const getFileName = () => `${primesForDownload.length} primes.txt`;

saveButtonEl.addEventListener('click', () => {
  const primeString = primesForDownload.join('\n');
  const blob = new Blob([primeString], {
    endings: 'native',
    type: 'text/plain',
  });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = getFileName();
  a.click();
});

/*  -------------------------  */
/*  --  CONSOLE DEBUGGING  --  */
/*  -------------------------  */

window.skipAheadByX = (count = 1) => {
  console.time('Generated primes in');
  skipAheadByX(count);
  console.timeEnd('Generated primes in');
};

/**
 * @example - In the console
 * > x = window.startGettingPrimes(1000000)
 * > clearInterval(x)
 */
window.startGettingPrimes = (count = 1000, limit = Infinity) => {
  let stopAt = Math.floor(getAndStorePrime() / count) * count;
  const timer = window.setInterval(() => {
    stopAt += count;

    const start = performance.now();
    primesEl.innerHTML = '';
    window.scrollTo(0, 0);

    while (true) {
      if (getAndStorePrime() > stopAt) break;
    }

    console.log(
      `Searched ${count.toLocaleString()} in`,
      Math.round(performance.now() - start)
    );

    fillScreenWithPrimes();
    console.log('Biggest prime is', getAndStorePrime().toLocaleString());

    if (!limit--) {
      console.log('All done!');
      clearInterval(timer);
    }
  }, 100);

  return timer;
};
