// const dlog = require('@genisense/dlog'); //real world
const dlog = require('../../../'); //using dlog src package.

const config = {
  include: ['*'],
  exclude: [],
  globalLogger: 'tlog',
  outputLogger: console.log,
  argCheck: true,
  timing: true,
  file: true,
  typeCheck: false
};

const logger = dlog.createLogger(config);

/*
  to use globalLogger need to require this (dlogger) early in application boot sequence e.g:
  require('../dlogger.js')
  tlog.log({ hello: {p1, p2} }); -anywhere in app, no more requires/imports needed.
*/
if (config.globalLogger) {
  global[config.globalLogger] = logger;
  console.log('_____OK hit');
  console.log('global ' + config.globalLogger + ' set.');
}

module.exports = logger;
