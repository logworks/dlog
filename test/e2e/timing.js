const dlog = require('./dlog.js');
const STEP = 15

variousTypes = [
  'astring',
  42, {}, [1, 2, 3, 4, 5],
  { a: [1, 2, 3, 4, 5] },
  new Date(),
  /x/,
  null,
  undefined,
  true,
  false,
  fn => () => { }
]
let variousTypesCount = 0;

cycleVariousTypes = () => {
  variousTypesCount += 1 % (variousTypes.length - 1)
  return variousTypes[variousTypesCount]
}

const tick = (p1, delay) => {
  dlog.log({ 'tick': { p1, delay } }, { arguments })

  setTimeout(() => {
    tock(cycleVariousTypes(), delay - STEP);
  }, delay - STEP);
};

const tock = (p1, delay) => {
  dlog.log({ 'tock': { p1, delay } }, { arguments })

  if (delay > 1) {
    setTimeout(() => {
      tick(cycleVariousTypes(), delay - STEP);
    }, delay - STEP);
  }
};

const timing = () => {
  // tick, followed tock, followed tick. 🌊
  tock(cycleVariousTypes(), 200);
};

module.exports = timing;
