// initialise logging early in app bootup

var dlog = require('./dlogger.js');

const basic = require('./basic.js');
const argChecking = require('./argChecking');
const timing = require('./timing');
const typeChecking = require('./typeChecking');

// basic();
//argChecking();
typeChecking();
// timing();

// example, updating config on the fly via global.
tlog.config.file = true;
basic();
