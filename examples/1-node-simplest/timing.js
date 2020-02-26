const dlog = require ('./dlog.js');


const tick = delay => {
  dlog.log( { 'tick' : {delay} }, { arguments } )

  setTimeout(() => {
    tock(delay - 15);
  }, delay - 15);
};

const tock = delay => {
  dlog.log( { 'tock' : {delay} }, { arguments } )

  if (delay > 1) {
    setTimeout(() => {
      tick(delay - 15);
    }, delay - 15);
  }
};

const timing = () => {
  // tick, followed tock, followed tick. 🌊
  tock(100);
};

module.exports = timing;
