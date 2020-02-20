//const dlog = require('@genisense/dlog'); //real world
const dlog = require('../../src/app'); //using dlog src.

const verboseLogger = (...args) => {
  for (let arg of args) {
    console.dir(arg);
  }
};

const config = {
  include: ['*'],
  exclude: [],
  globalLogger: 'tlog',
  outputLogger: verboseLogger,
  argCheck: true, //needs also to be set in .dlogrc before $ dlog + run. -or always add to meta.
  timing: false,
  file: false,
  typeCheck: true
};

const logger = dlog.createLogger(config);

/*
  tlog.log({ hello: {p1, p2} }); -anywhere in app, no more requires/imports needed.
*/
if (config.globalLogger) {
  global[config.globalLogger] = logger;
  console.log('global ' + config.globalLogger + ' set.');
}

console.log('dlog config', logger.config);

module.exports = logger;
