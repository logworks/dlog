const autodlog = require ('./dlogger.js');
const tick = delay => {
  autodlog.log( { 'tick' : {delay} }, { arguments } )


  setTimeout(() => {
    tock(delay - 5);
  }, delay - 5);
};

const tock = delay => {
  autodlog.log( { 'tock' : {delay} }, { arguments } )

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
