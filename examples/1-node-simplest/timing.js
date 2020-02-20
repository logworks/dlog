const tick = delay => {
  dlog.log({ tick: { delay } });
  setTimeout(() => {
    tock(delay - 1);
  }, delay - 1);
};

const tock = delay => {
  dlog.log({ tock: { delay } });
  setTimeout(() => {
    tick(delay - 1);
  }, delay - 1);
};

const timing = () => {
  // tick, followed tock, followed tick. 🌊
  tock(1000);
};

module.exports = timing;
