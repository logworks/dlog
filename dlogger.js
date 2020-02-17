/*
  use dlog at development time to test dlog.
  -eat our own dog food!
*/

const dlog = require('@genisense/dlog');

/*
  
  configure/ customise your runtime dlog.log here.

*/
const config = {
  include: ['*'],
  exclude: [],
  globalLogger: 'tlog',
  typeCheck: false,
  meta: {
    timeStamp: true,
    file: true
  }
};

const logger = dlog.createLogger(config);

if (config.globalLogger) {
  global[config.globalLogger] = logger;
  console.log('global ' + config.globalLogger + ' set.');
  // to use, need to require this (dlogger) early in application boot sequence e.g:
  // require('../dlogger.js')
  // tlog.log({ hello: {p1, p2} }); -anywhere in app, no more requires/imports needed.
}

module.exports = logger;
