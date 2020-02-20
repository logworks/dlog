import dlog from '@genisense/dlog';

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
  argCheck: true,
  typeCheck: false,
  timing: false,
  file: false
};

const logger = dlog.createLogger(config);
/*
  to use globalLogger need to require this (dlogger) early in application boot sequence e.g:
  require('../dlogger.js')
  tlog.log({ hello: {p1, p2} }); -anywhere in app, no more requires/imports needed.
*/
if (config.globalLogger) {
  window[config.globalLogger] = logger;
  console.log('global ' + config.globalLogger + ' set.');
}

export default logger;
