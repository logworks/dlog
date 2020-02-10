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
    level: true,
    timeStamp: true,
    file: true,
    stack: true
  }
};

const logger = dlog.createLogger(config);

if (config.globalLogger) {
  global[config.globalLogger] = logger;
  console.log('global ' + config.globalLogger + ' set.');
}

module.exports = logger;
