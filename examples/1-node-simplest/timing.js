const autodlog = require ('./dlogger.js');
const tick = delay => {
  autodlog.log({'tick': {delay} }  , { arguments })

  dlog.log({ tick: { delay } });
  setTimeout(() => {
    tock(delay - 1);
  }, delay - 1);
};

const tock = delay => {
  autodlog.log({'tock': {delay} }  , { arguments })

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
