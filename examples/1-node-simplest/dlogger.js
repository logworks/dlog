// const dlog = require('../../dist/dlog.js');
const dlog = require('../../src/app');

const config = {
  include: ['*'],
  exclude: [],
  globalLogger: 'tlog',
  outputLogger: console.log,
  argCheck: true,
  typeCheck: false,
  meta: {
    timeStamp: false,
    file: false
  }
};

const logger = dlog.createLogger(config);

/*
  to use globalLogger need to require this (dlogger) early in application boot sequence e.g:
  require('../dlogger.js')
  tlog.log({ hello: {p1, p2} }); -anywhere in app, no more requires/imports needed.
*/
if (config.globalLogger) {
  global[config.globalLogger] = logger;
  console.log('global ' + config.globalLogger + ' set.');
}

module.exports = logger;
