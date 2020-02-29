const dlog = require ('./dlog.js');
// initialise logging early in app bootup
const basic = require('./basic.js');
const argChecking = require('./argChecking');
const timing = require('./timing');
const timingLongShort = require('./timingLongShort')
const typeChecking = require('./typeChecking');
const indentDetect = require('./indentDetect');
const moduleNaming = require('./moduleNaming')

const vanilla = function (p1) {
  dlog.log( { 'vanilla' : {p1 : p1} }, { arguments } )
  return p1;
};

const mint = function () {
  dlog.log( { 'mint' : {} }, { arguments } )

  return;
};

//vanilla('A');
// vanilla('A', 'B');
// vanilla();
// mint('A', 'B');
// basic();
// timing();
// indentDetect();
//timingLongShort();
// argChecking();
//typeChecking();

//d.config.file = true;
// basic();
