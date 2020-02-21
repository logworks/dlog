// initialise logging early in app bootup
const dlog = require('./dlogger');
const basic = require('./basic.js');
const argChecking = require('./argChecking');
const timing = require('./timing');
const typeChecking = require('./typeChecking');
const indentDetect = require('./indentDetect');

basic();
argChecking();
typeChecking();
indentDetect();
// example, updating config on the fly via global.
// timing();

//d.config.file = true;
//basic();
