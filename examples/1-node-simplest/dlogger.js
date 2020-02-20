//const dlog = require('@genisense/dlog'); //real world
const dlog = require('../../src/app'); //using dlog src.

const config = {
  include: ['*'],
  exclude: [],
  globalLogger: 'tlog',
  outputLogger: console.log,
  argCheck: true,
  timing: true,
  file: false,
  typeCheck: false
};

const logger = dlog.createLogger(config);

/*
  tlog.log({ hello: {p1, p2} }); -anywhere in app, no more requires/imports needed.
*/
if (config.globalLogger) {
  global[config.globalLogger] = logger;
  console.log('global ' + config.globalLogger + ' set.');
}

module.exports = logger;
