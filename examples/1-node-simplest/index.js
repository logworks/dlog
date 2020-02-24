// initialise logging early in app bootup
const dlog = require('./dlog');
const basic = require('./basic.js');
const argChecking = require('./argChecking');
const timing = require('./timing');
const timingLongShort = require('./timingLongShort')
const typeChecking = require('./typeChecking');
const indentDetect = require('./indentDetect');

const vanilla = function (p1) {
  dlog.log({ vanilla: { p1 } });
  return p1;
};

const mint = function () {
  dlog.log({ mint: {} });
  return;
};

// vanilla('A');
// vanilla('A', 'B');
// vanilla();
// mint('A', 'B');
// basic();

indentDetect();
// example, updating config on the fly via global.
// timing();
argChecking();
//typeChecking();
timingLongShort()

//d.config.file = true;
// basic();
