const autodlog = require('./dlog.js');
const STEP = 1
const tick = delay => {
  autodlog.log({ tick: { delay } }, { arguments });

  setTimeout(() => {
    tock(delay - STEP);
  }, delay - STEP);
};

const tock = delay => {
  autodlog.log({ tock: { delay } }, { arguments });

  if (delay > 1) {
    setTimeout(() => {
      tick(delay - STEP);
    }, delay - STEP);
  }
};

const timing = () => {
  // tick, followed tock, followed tick. 🌊
  tock(100);
};

module.exports = timing;
