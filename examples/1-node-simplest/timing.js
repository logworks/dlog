const tick = delay => {

  setTimeout(() => {
    tock(delay - 5);
  }, delay - 5);
};

const tock = delay => {
  if (delay > 1) {
    setTimeout(() => {
      tick(delay - 5);
    }, delay - 5);
  }
};

const timing = () => {
  // tick, followed tock, followed tick. 🌊
  tock(100);
};

module.exports = timing;
